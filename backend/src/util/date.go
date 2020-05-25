package util

import (
	"fmt"
	"time"
)

// DateToday - returns the date today
func DateToday() string {
	return time.Now().UTC().String()
}

// DateYesterday - returns the date yesterday
func DateYesterday() string {
	t := time.Now().UTC()
	y := t.Add(time.Hour * -24)
	td := fmt.Sprintf("%d-%d-%d", y.Month(), y.Day(), y.Year())
	return td
}
