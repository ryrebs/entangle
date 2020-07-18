package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo) {
	e.GET("/ping", PingHandler)
	e.POST("/auth", AuthenticateHandler)
	e.POST("/auth/refresh", RefreshHandler)
	e.POST("/mobile/updatelocation", UpdateTrackerLocationHandler)
	e.POST("/mobile/addtarget", AddTargetHandler)
	e.POST("/mobile/deletetrackerontarget", TargetDeleteTrackerHandler)
	e.GET("/mobile/location", LocationHandler)
	e.DELETE("/mobile/deletetracker", TrackerDeleteHandler)
}
