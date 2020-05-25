package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo) {
	e.POST("/auth", AuthenticateHandler)
	e.POST("/auth/refresh", RefreshHandler)
	e.GET("/api/location", LocationHandler)
}
