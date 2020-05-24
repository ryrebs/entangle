package route

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// LocationHandler - handles get location request
func LocationHandler(c echo.Context) (err error) {
	return c.JSON(http.StatusOK, struct {
		Msg string `json:"msg"`
	}{
		Msg: "locations are...",
	})
}
