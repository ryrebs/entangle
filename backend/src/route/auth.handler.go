package route

import (
	"net/http"
	"strings"
	"time"
	"tracking/backend/db"
	"tracking/backend/util"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type claims struct {
	Lat float32 `json:"lat" validate:"required"`
	Lng float32 `json:"lng" validate:"required"`
	jwt.StandardClaims
}

type response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// TrackerID - for context key of trackerID
var TrackerID string = "trackerID"

var client = db.GetDefaultClient()

var locationCollection = client.Database(db.LocationDb).Collection(db.LocationCollection)

var tokenExpirationInMinutes = time.Minute * 1

// Test:
// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXQiOjEuMiwibG5nIjoxLjN9.5_tEKxoz9-9YVW0TjGfMR9nkMtbzLLNyw0PQKppOWO0"}' \
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
	invalidRequest := &response{
		Message: "Token Invalid or Expired",
		Status:  http.StatusBadRequest,
		Data:    nil,
	}
	if err = c.Bind(user); err != nil {
		return
	}
	if err = Validate(user); err != nil {
		msg := ExtractError(user, err)
		util.LogInDev("Validate user", msg)
		return c.JSON(http.StatusBadRequest, invalidRequest)
	}
	claims, ok := validateClientToken(user)
	if ok != true {
		return c.JSON(http.StatusBadRequest, invalidRequest)
	}
	timeNow := time.Now()
	timeNowUTC := timeNow.UTC()
	tracker := createUser(claims.Lat, claims.Lng)
	if len(tracker) > 0 {
		reqToken, cErr := CreateToken(&jwt.StandardClaims{
			Subject:   string(tracker),
			ExpiresAt: timeNowUTC.Add(tokenExpirationInMinutes).Unix()})
		if cErr != nil {
			return c.JSON(http.StatusBadRequest, invalidRequest)
		}
		return c.JSON(http.StatusCreated, struct {
			Token string `json:"token"`
		}{
			Token: reqToken,
		})
	}
	return c.JSON(http.StatusBadRequest, invalidRequest)
}

func createUser(lat, lng float32) []byte {
	user, _ := bson.Marshal(struct {
		Lat        float32
		Lng        float32
		LastUpdate string
		Status     string
		Targets    []string
	}{
		Lat:        lat,
		Lng:        lng,
		LastUpdate: util.DateToday(),
		Status:     "Active",
		Targets:    []string{},
	})
	id := db.InsertOne(user, locationCollection)
	if id != nil {
		util.LogInDev("::::ID::::", id)
		d, _ := id.(primitive.ObjectID).MarshalJSON()
		return d
	}
	// jobs := []interface{}{}
	//
	// 		jobs = append(jobs, jobBson)
	// 	}
	// 	InsertIntoCollection(jobs, collection)
	return []byte("")
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

// CreateToken - creates new token
func CreateToken(claims *jwt.StandardClaims) (tokenString string, err error) {
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

// curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA0MzE5MTEsInN1YiI6IlwiNWVjYzEwNmI0M2Q1MmJmODZhZGQwZDkwXCIifQ.uG3z46DMbmmB4VCrAkIRQTVL3xVNpqCiwEVITW3N3xM" http://localhost:5000/api/location

// ValidateAPIRequest - validates request to api
func ValidateAPIRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		p := c.Path()
		if strings.Contains(p, "api") {
			token := c.Request().Header.Get(echo.HeaderAuthorization)
			clm, ok := validateServerToken(token)
			if !ok {
				return c.JSON(http.StatusBadRequest, &response{
					Message: "Token Invalid or Expired",
					Status:  http.StatusBadRequest,
					Data:    nil,
				})
			}
			c.Set(TrackerID, string(clm.Subject))
		}
		return next(c)
	}
}

func validateServerToken(token string) (*jwt.StandardClaims, bool) {
	t, _ := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if clms, ok := t.Claims.(*jwt.StandardClaims); ok && t.Valid {
		return clms, true
	} else if ok && !t.Valid {
		setTrackerExpiredStatus(string(clms.Subject))
	}
	return nil, false
}

// TODO: Implement set trackerId  status to expired
func setTrackerExpiredStatus(id string) {
}
