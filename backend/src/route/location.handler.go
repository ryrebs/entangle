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
	// request: target: [1,2]
	// response: targets: [{id: 1,lat: 123,lng:123},{id: 2,lat: 123,lng:123}]
	return c.JSON(http.StatusOK, struct {
		Msg string `json:"msg"`
	}{
		Msg: "locations are...",
	})
}

// TODO: implement

// AddTargetHandler - add targets minimum 1, array of targets
func AddTargetHandler() {
	// request: targets [1, 2]
	// search if target exists return only existing target
	// add target to trackers target list
	// response: targets [{id: 1, lat: 123, lng,123}, {id:2, lat:123, lng:123}]
}

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
