package util

import (
	"log"
	"os"
)

// LogInDev - logs when not in production
func LogInDev(key string, msg interface{}) {
	if os.Getenv("ENV") != "production" {
		log.Printf("::::%s:::: %s", key, msg)
	}
}
