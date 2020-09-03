package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo, lg *echo.Group) {
	e.GET("/ping", PingHandler)
	e.POST("/auth", AuthenticateHandler)
	e.POST("/auth/refresh", RefreshHandler)
	lg.POST("/update", UpdateTrackerLocationHandler)
	lg.POST("/addtarget", AddTargetHandler)
	lg.POST("/deletetrackerontarget", TargetDeleteTrackerHandler)
	lg.GET("/fetch", LocationHandler)
	lg.DELETE("/deletetracker", TrackerDeleteHandler)
}
