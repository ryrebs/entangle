package route

import (
	"errors"
	"fmt"
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
	Lat float64 `json:"lat" validate:"required"`
	Lng float64 `json:"lng" validate:"required"`
	jwt.StandardClaims
}

// Response - api response
type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// TrackerID - for context key of trackerID
var TrackerID string = "trackerID"

var client = db.GetDefaultClient()

// LocationCollection - the location collection
var LocationCollection = client.Database(db.LocationDb).Collection(db.LocationCollection)

var tokenExpirationInMinutes = time.Hour * 24 // time.Minute * 525600

// RefreshHandler - refreshes the token
// @tags Refresh token
// @Summary Refresh the expired  token
// @Accept  json
// @Produce  json
// @Header 201 {string} Token
// @Router /refresh [post]
func RefreshHandler(c echo.Context) (err error) {
	user := &GenericUser{}
	invalidRequest := Response{
		Message: "Token Invalid",
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
	t, _ := jwt.ParseWithClaims(user.Token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if clms, ok := t.Claims.(*jwt.StandardClaims); ok {
		tracker := clms.Subject
		err := setTrackerActiveStatus(tracker)
		if err != nil {
			return c.JSON(http.StatusBadRequest, invalidRequest)
		}
		reqToken, cErr := CreateToken(createStandardClaims(string(tracker)))
		if cErr != nil {
			return c.JSON(http.StatusBadRequest, invalidRequest)
		}
		util.LogInDev("REFRESH", "done")
		return c.JSON(http.StatusCreated, &Response{
			Message: "Token",
			Status:  http.StatusCreated,
			Data:    reqToken,
		})
	}
	return c.JSON(http.StatusBadRequest, invalidRequest)
}

// AuthenticateHandler - handles /auth route
// @tags Auth
// @Summary Creates token for subscribers
// @Description TODO
// @Accept  json
// @Produce  json
// @Param id formData string true "id of connecting client"
// @Header 200 {string} Token
// @Router /auth [post]
func AuthenticateHandler(c echo.Context) (err error) {
	user := &GenericUser{}
	invalidRequest := Response{
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
	tracker := createUser(claims.Lat, claims.Lng)
	if len(tracker) > 0 {
		reqToken, cErr := CreateToken(createStandardClaims(string(tracker)))
		if cErr != nil {
			return c.JSON(http.StatusBadRequest, invalidRequest)
		}
		return c.JSON(http.StatusCreated, &Response{
			Message: "Token",
			Status:  http.StatusCreated,
			Data:    reqToken,
		})
	}
	return c.JSON(http.StatusBadRequest, invalidRequest)
}

func createUser(lat, lng float64) []byte {
	user, _ := bson.Marshal(struct {
		Lat        float64
		Lng        float64
		LastUpdate int64 `bson:"lastUpdate"`
		Status     string
		Trackers   []string
	}{
		Lat:        lat,
		Lng:        lng,
		LastUpdate: util.DateToday(),
		Status:     "Active",
		Trackers:   []string{},
	})
	id := db.InsertOne(user, LocationCollection)
	if id != nil {
		util.LogInDev("::::ID::::", id)
		d, _ := id.(primitive.ObjectID).MarshalJSON()
		return d
	}
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

// createStandardClaims - creates token with claims Sub and Exp
func createStandardClaims(sub string) *jwt.StandardClaims {
	timeNow := time.Now()
	timeNowUTC := timeNow.UTC()
	return &jwt.StandardClaims{
		Subject:   sub,
		ExpiresAt: timeNowUTC.Add(tokenExpirationInMinutes).Unix()}
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

// ValidateAPIRequest - check valid token and an existing tracker
func ValidateAPIRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		p := c.Path()
		response := Response{
			Message: "Token Invalid or Expired",
			Status:  http.StatusBadRequest,
			Data:    nil,
		}
		if strings.Contains(p, "mobile") {
			token := c.Request().Header.Get(echo.HeaderAuthorization)
			clm, ok := validateServerToken(token)
			if !ok {
				return c.JSON(http.StatusBadRequest, response)
			}
			c.Set(TrackerID, string(clm.Subject))
		}
		return next(c)
	}
}

func validateServerToken(token string) (*jwt.StandardClaims, bool) {
	if token != "" {
		t, _ := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				util.LogInDev("ERR:ParseWithClaims", "Invalid signing method")
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(SecretKey), nil
		})
		if clms, ok := t.Claims.(*jwt.StandardClaims); ok && t.Valid {
			util.LogInDev("TRACKER", clms.Subject)
			err := validateTrackerExistence(clms.Subject)
			if err != nil {
				return nil, false
			}
			return clms, true
		} else if ok && !t.Valid {
			setTrackerExpiredStatus(clms.Subject)
		}
	}
	return nil, false
}

func setTrackerExpiredStatus(id string) error {
	util.LogInDev("TRACKER", id)
	changes := struct{ Status string }{Status: "Expired"}
	filter := db.CreateObjectID(id)
	setChanges := struct {
		Set interface{} `bson:"$set"`
	}{
		Set: changes,
	}
	_, err := db.FindOneAndUpdate(setChanges, filter, LocationCollection)
	if err != nil {
		util.LogInDev("ERR:setTrackerExpiredStatus", err.Error())
		return err
	}
	return nil
}

func setTrackerActiveStatus(id string) error {
	changes := struct{ Status string }{Status: "Active"}
	filter := db.CreateObjectID(id)
	setChanges := struct {
		Set interface{} `bson:"$set"`
	}{
		Set: changes,
	}
	_, err := db.FindOneAndUpdate(setChanges, filter, LocationCollection)
	if err != nil {
		util.LogInDev("ERR:setTrackerActiveStatus", err.Error())
		return err
	}
	return nil
}

func validateTrackerExistence(id string) error {
	filter := db.CreateObjectID(id)
	doc, err := db.FindOne(filter, LocationCollection)
	if err != nil {
		return err
	}
	if v, ok := doc["status"]; v == "Expired" || !ok {
		return errors.New("Invalid Status")
	}
	return nil
}
