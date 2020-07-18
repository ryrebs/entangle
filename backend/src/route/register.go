package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo) {
	e.GET("/ping", PingHandler)
	e.POST("/auth", AuthenticateHandler)
	e.POST("/auth/refresh", RefreshHandler)
	e.POST("/location/update", UpdateTrackerLocationHandler)
	e.POST("/location/addtarget", AddTargetHandler)
	e.POST("/location/deletetrackerontarget", TargetDeleteTrackerHandler)
	e.GET("/location/fetch", LocationHandler)
	e.DELETE("/location/deletetracker", TrackerDeleteHandler)
}
