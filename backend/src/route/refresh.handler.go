package route

import (
	"tracking/backend/util"

	"github.com/labstack/echo/v4"
)

// TODO: implement

// RefreshHandler - refreshes the token
func RefreshHandler(c echo.Context) error {
	// check if exist
	// set tracker status active
	// create new request token , createToken()
	util.LogInDev("REFRESH", "")
	return nil
}
