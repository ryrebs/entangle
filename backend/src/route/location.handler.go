package route

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// TODO: handle deleted trackers

// TODO: query location

// LocationHandler - handles get location request
func LocationHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	log.Println(trackerID)
	// TODO: get location request
	return c.JSON(http.StatusOK, struct {
		Msg string `json:"msg"`
	}{
		Msg: "locations are...",
	})
}

// TODO: implement

// AddTargetHandler - add targets minimum 1, array of targets
// targets have more control, since this is a self created id by the target/tracker
func AddTargetHandler() {}

// TODO: implement

// DeleteTargetHandler - remove target from db, array of targets
func DeleteTargetHandler() {}

// TODO: implement

// DeleteTrackerHandler - deletes the tracker
func DeleteTrackerHandler() {}

// TODO: feature idea

// tracker can create a tracking to have control of the target
// tracking id cannot be deleted by the target
// Locked on target id
