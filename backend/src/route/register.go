package route

import (
	"github.com/labstack/echo/v4"
)

// Register - register all routes here
func Register(e *echo.Echo) {
	e.POST("/auth", AuthenticateHandler)
	e.GET("/api/location", LocationHandler)
}
