package break_cache

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func BreakCache(cacheName string) error {
	apiKey := os.Getenv("WEB_APP_API_KEY")
	url := os.Getenv("WEB_APP_URL")

	if apiKey == "" {
		return fmt.Errorf("API key not found")
	}

	if url == "" {
		return fmt.Errorf("URL not found")
	}

	err := callApi(url, apiKey, cacheName)

	if err != nil {
		return err
	}

	return nil
}

func callApi(url string, apiKey string, cacheName string) error {
	postBody, _ := json.Marshal(map[string]string{
		"cacheName": cacheName,
		"apiKey":    apiKey,
	})

	body := bytes.NewBuffer(postBody)

	_, err := http.Post(url+"/api/breakCache", "application/json", body)
	if err != nil {
		return fmt.Errorf("Could not reach web app to break cache: %v", err)
	}
	return nil
}
