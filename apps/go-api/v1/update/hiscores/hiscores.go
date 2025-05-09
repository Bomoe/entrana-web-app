package hiscores

import (
	"context"
	"encoding/json"
	"fmt"
	"go-api/utils/database"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/jackc/pgx/v5"
)

/*
*
START OF WISEOLDMAN SPECIFIC STRUCTS
this will need to be replaced with a database call in the future rather then rely
on wiseoldman to manage the clan member list.
*/
type Player struct {
	ID             int64   `json:"id"`
	Username       string  `json:"username"`
	DisplayName    string  `json:"displayName"`
	Type           string  `json:"type"`
	Build          string  `json:"build"`
	Country        string  `json:"country"`
	Status         string  `json:"status"`
	Patron         bool    `json:"patron"`
	Exp            float64 `json:"exp"`
	EHP            float64 `json:"ehp"`
	EHB            float64 `json:"ehb"`
	TTM            float64 `json:"ttm"`
	TT200M         float64 `json:"tt200m"`
	RegisteredAt   string  `json:"registeredAt"`
	UpdatedAt      string  `json:"updatedAt"`
	LastChangedAt  string  `json:"lastChangedAt"`
	LastImportedAt string  `json:"lastImportedAt"`
}

type Membership struct {
	PlayerID  int64  `json:"playerId"`
	GroupID   int64  `json:"groupId"`
	Role      string `json:"role"` // Can be "administrator" or "moderator"
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	Player    Player `json:"player"`
}

type Group struct {
	ID           int64        `json:"id"`
	Name         string       `json:"name"`
	ClanChat     *string      `json:"clanChat"`
	Description  string       `json:"description"`
	Homeworld    *int         `json:"homeworld"`
	Verified     bool         `json:"verified"`
	Patron       bool         `json:"patron"`
	ProfileImage *string      `json:"profileImage"`
	BannerImage  *string      `json:"bannerImage"`
	Score        int64        `json:"score"`
	CreatedAt    string       `json:"createdAt"`
	UpdatedAt    string       `json:"updatedAt"`
	Memberships  []Membership `json:"memberships"`
	MemberCount  int          `json:"memberCount"`
}

/**
END OF WISEOLDMAN SPECIFIC STRUCTS
*/

type Skill struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Rank  int64  `json:"rank"`
	Level int64  `json:"level"`
	Xp    int64  `json:"xp"`
}

type Activity struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Rank  int64  `json:"rank"`
	Score int64  `json:"score"`
}

type CombinedSkillActivity struct {
	Skills     []Skill
	Activities []Activity
}

type Hiscore struct {
	RSN        string
	Skills     []Skill
	Activities []Activity
}

type DatabaseSkill struct {
	rsn string
	Skill
}

type DatabaseActivity struct {
	rsn string
	Activity
}

type DatabaseHiscore struct {
	rsn          string
	SkillJson    map[int64]Skill
	ActivityJson map[int64]Activity
}

func UpdateHiscores(w http.ResponseWriter, r *http.Request, db *database.DB) {
	log.Println("Starting to update hiscores...")
	members, err := getAllMembers()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to get members: "+err.Error(), http.StatusInternalServerError)
		return
	}
	error := updateAllMembers(members, db)
	if error != nil {
		log.Fatal(error)
		http.Error(w, "Failed to upload all members: "+error.Error(), http.StatusInternalServerError)
		return
	}

	var allHiscores []Hiscore

	var hiscoreFetchWG sync.WaitGroup
	workers := make(chan struct{}, 10)

	for _, rsn := range members {
		hiscoreFetchWG.Add(1)
		go func(rsn string) {
			defer hiscoreFetchWG.Done()

			workers <- struct{}{}
			hiscores, err := getRunescapeHiscores(rsn)
			if err != nil {
				fmt.Printf("Error fetching hiscores for %s: %v\n", rsn, err)
			} else {
				allHiscores = append(allHiscores, hiscores)
			}

			<-workers
		}(rsn)
	}
	hiscoreFetchWG.Wait()

	err = uploadHiscoresData(allHiscores, db)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to upload hiscores: "+err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("Finished updating hiscores...")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Hiscores updated successfully"})
}

func getAllMembers() ([]string, error) {
	res, err := http.Get("https://api.wiseoldman.net/v2/groups/10494")
	if err != nil {
		return nil, fmt.Errorf("Could not reach wiseoldman: %v", err)
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Wiseoldman did not return a 200 status: %v", err)
	}

	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Errorf("Error when reading wiseoldman body: %v", err)
	}

	var group Group
	err = json.Unmarshal(body, &group)
	if err != nil {
		return nil, fmt.Errorf("Error unmarshaling wiseoldman JSON response: %v", err)
	}

	var finalDisplayNames []string

	for _, player := range group.Memberships {

		finalDisplayNames = append(finalDisplayNames, player.Player.DisplayName)
	}

	return finalDisplayNames, nil
}

func updateAllMembers(rsnArr []string, db *database.DB) error {
	ctx := context.Background()

	tx, err := db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	batch := &pgx.Batch{}

	for _, rsn := range rsnArr {
		batch.Queue(`
			INSERT INTO members (rsn)
			VALUES ($1)
			ON CONFLICT (rsn) DO NOTHING
		`, rsn)
	}

	results := tx.SendBatch(ctx, batch)

	// Check for errors in each operation
	for i := range batch.Len() {
		if _, err := results.Exec(); err != nil {
			return fmt.Errorf("batch operation %d failed: %w", i, err)
		}
	}

	if err := results.Close(); err != nil {
		return fmt.Errorf("closing batch results: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func getRunescapeHiscores(rsn string) (Hiscore, error) {
	formattedName := strings.ReplaceAll(rsn, " ", "_")
	url := `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=` + formattedName

	res, err := http.Get(url)
	if err != nil {
		return Hiscore{}, fmt.Errorf("Could not reach hiscores: %v", err)
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return Hiscore{}, fmt.Errorf("Hiscores did not return a 200 status: %v", err)
	}

	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Errorf("Error when reading hiscores body: %v", err)
	}

	var playerStats CombinedSkillActivity
	err = json.Unmarshal(body, &playerStats)
	if err != nil {
		return Hiscore{}, fmt.Errorf("Error unmarshaling hiscores JSON response: %v", err)
	}

	return Hiscore{RSN: rsn, Skills: playerStats.Skills, Activities: playerStats.Activities}, nil
}

func uploadHiscoresData(allHiscores []Hiscore, db *database.DB) error {
	var uploadArr []DatabaseHiscore

	for _, player := range allHiscores {
		formattedSkills := make(map[int64]Skill)
		formattedActivities := make(map[int64]Activity)

		for _, skill := range player.Skills {
			if _, exists := formattedSkills[skill.ID]; !exists {
				formattedSkills[skill.ID] = skill
			}
		}

		for _, activity := range player.Activities {
			if _, exists := formattedActivities[activity.ID]; !exists {
				formattedActivities[activity.ID] = activity
			}
		}

		uploadArr = append(uploadArr, DatabaseHiscore{
			rsn:          player.RSN,
			SkillJson:    formattedSkills,
			ActivityJson: formattedActivities,
		})
	}

	ctx := context.Background()

	tx, err := db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	batch := &pgx.Batch{}

	for _, hiscore := range uploadArr {
		skillsJSON, err := json.Marshal(hiscore.SkillJson)
		if err != nil {
			return fmt.Errorf("failed to marshal skills JSON: %w", err)
		}

		activitiesJSON, err := json.Marshal(hiscore.ActivityJson)
		if err != nil {
			return fmt.Errorf("failed to marshal activities JSON: %w", err)
		}

		batch.Queue(`
			INSERT INTO hiscores (rsn, skills, activities)
			VALUES ($1, $2::jsonb, $3::jsonb)
		`, hiscore.rsn, string(skillsJSON), string(activitiesJSON))
	}

	results := tx.SendBatch(ctx, batch)

	// Check for errors in each operation
	for i := range batch.Len() {
		if _, err := results.Exec(); err != nil {
			return fmt.Errorf("batch operation %d failed: %w", i, err)
		}
	}

	if err := results.Close(); err != nil {
		return fmt.Errorf("closing batch results: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
