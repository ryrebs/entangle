package util

import (
	"fmt"
	"time"
)

// DateToday - returns the date today in unix timestamp
func DateToday() int64 {
	return time.Now().UTC().Unix()
}

// DateYesterday - returns the date yesterday
func DateYesterday() string {
	t := time.Now().UTC()
	y := t.Add(time.Hour * -24)
	td := fmt.Sprintf("%d-%d-%d", y.Month(), y.Day(), y.Year())
	return td
}
