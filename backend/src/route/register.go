package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo) {
	e.POST("/auth", AuthenticateHandler)
	e.POST("/auth/refresh", RefreshHandler)
	e.POST("/api/updatelocation", updateTrackerLocationHandler)
	e.POST("/api/addtarget", AddTargetHandler)
	e.POST("/api/deletetrackerontarget", TargetDeleteHandler)
	e.GET("/api/location", LocationHandler)
	e.DELETE("/api/deletetracker", TrackerDeleteHandler)
}
