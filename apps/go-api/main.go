package main

import (
	"go-api/utils/database"
	"go-api/v1/update/hiscores"
	"log"
	"net/http"
)

func main() {
	db, err := database.OpenDB()
	if err != nil {
		log.Fatalf("Could not initialize database connection pool: %v", err)
	}

	defer db.Close()

	http.HandleFunc("/v1/update/hiscores", func(w http.ResponseWriter, r *http.Request) {
		hiscores.UpdateHiscores(w, r, db)
	})

	err = http.ListenAndServe((":" + "8080"), nil)
	if err != nil {
		log.Fatal(err)
	}
}
