package route

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// PingHandler returns pong for testing server status
func PingHandler(c echo.Context) (err error) {
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "pong",
		Data:    nil,
	})
}
