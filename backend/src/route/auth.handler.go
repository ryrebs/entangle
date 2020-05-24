package route

import (
	"fmt"
	"net/http"
	"strings"
	"time"
	"tracking/backend/util"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type claims struct {
	Lat float32 `json:"lat" validate:"required"`
	Lng float32 `json:"lng" validate:"required"`
	jwt.StandardClaims
}

// Test:
// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJsbmciOjEuMywibGF0IjoxLjR9.fXw0BJ6EM47oGLM5IATc8O-pQFUwiUpRvhTk0vZqbMQ"}' \
//   http://localhost:5000/auth

// AuthenticateHandler - handles /authenticate route
// @tags Auth
// @Summary Creates token for subscribers
// @Description TODO
// @Accept  json
// @Produce  json
// @Param id formData string true "id of connecting client"
// @Header 200 {string} Token
// @Router /authenticate [post]
func AuthenticateHandler(c echo.Context) (err error) {
	user := &GenericUser{}
	if err = c.Bind(user); err != nil {
		return
	}
	if err = Validate(user); err != nil {
		msg := ExtractError(user, err)
		util.LogInDev("Validate user", msg)
		return c.JSON(http.StatusBadRequest, struct{}{})
	}
	claims, ok := validateClientToken(user)
	if ok != true {
		return c.JSON(http.StatusBadRequest, struct{}{})
	}
	timeNow := time.Now()
	timeNowUTC := timeNow.UTC()
	reqToken, cErr := createToken(&jwt.StandardClaims{
		Subject:   createUser(claims.Lat, claims.Lng),
		ExpiresAt: timeNowUTC.Add(time.Minute * 30).Unix()})
	if cErr != nil {
		return c.JSON(http.StatusBadRequest, struct{}{})
	}
	return c.JSON(http.StatusCreated, struct {
		Token string `json:"token"`
	}{
		Token: reqToken,
	})
}

func createUser(lat, lng float32) string {
	// TODO: create actual user from db
	return fmt.Sprintf("%f%f", lat, lng)
}

func validateClientToken(user *GenericUser) (*claims, bool) {
	tokenString := user.Token
	token, err := jwt.ParseWithClaims(tokenString, &claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretClientKey), nil
	})
	if err != nil {
		util.LogInDev("ERR", err)
		return nil, false
	}
	if clms, ok := token.Claims.(*claims); ok && token.Valid {
		err := clms.validateClaim()
		if err != nil {
			util.LogInDev("ERR", err)
			return nil, false
		}
		return clms, true
	}
	return nil, false
}

func validateServerToken(token string) bool {
	_, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		return false
	}
	return true
}

func createToken(claims *jwt.StandardClaims) (tokenString string, err error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString([]byte(SecretKey))
	return tokenString, err
}

func (c *claims) validateClaim() (err error) {
	validate = validator.New()
	if err = validate.Struct(c); err != nil {
		return
	}
	return nil
}

// curl --header "Authorization: sdlkfasl;dk;sldkf" http://localhost:5000/api/location
// ValidateAPIRequest - validates request to api
func ValidateAPIRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		p := c.Path()
		if strings.Contains(p, "api") {
			token := c.Request().Header.Get(echo.HeaderAuthorization)
			if ok := validateServerToken(token); !ok {
				return c.JSON(http.StatusBadRequest, struct{}{})
			}
		}
		return next(c)
	}
}
