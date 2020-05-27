package route

import (
	"os"

	"github.com/go-playground/validator/v10"
)

// SecretKey for auth
var SecretKey string = os.Getenv("SECRET_KEY")

// SecretClientKey for client auth
var SecretClientKey string = os.Getenv("SECRET_CLIENT_KEY")

var validate *validator.Validate

// ErrorUser errors
type ErrorUser struct {
	Status int    `json:"status"`
	Msg    string `json:"msg"`
}

// User interface
type User interface {
	validate() error
	extractValidationError(error) string
}

// GenericUser for registration
type GenericUser struct {
	Token string `json:"token" validate:"required"`
	err   map[string]string
}

func (u *GenericUser) validate() (err error) {
	validate = validator.New()
	if err = validate.Struct(u); err != nil {
		return
	}
	return nil
}

func (u *GenericUser) extractValidationError(err error) (errs string) {
	allErrors := ""
	e := map[string]string{
		"required": " should not be empty.",
	}
	for _, errss := range err.(validator.ValidationErrors) {
		msg, ok := e[errss.Tag()]
		if ok {
			allErrors = allErrors + errss.Field() + msg + "\n"
		}
	}
	return allErrors
}

// UpdateLocation -  update tracker location
type UpdateLocation struct {
	Lat float64 `json:"lat" validate:"required"`
	Lng float64 `json:"lng" validate:"required"`
	err map[string]string
}

func (u *UpdateLocation) validate() (err error) {
	validate = validator.New()
	if err = validate.Struct(u); err != nil {
		return
	}
	return nil
}

func (u *UpdateLocation) extractValidationError(err error) (errs string) {
	allErrors := ""
	e := map[string]string{
		"required": " should not be empty.",
	}
	for _, errss := range err.(validator.ValidationErrors) {
		msg, ok := e[errss.Tag()]
		if ok {
			allErrors = allErrors + errss.Field() + msg + "\n"
		}
	}
	return allErrors
}

// Targets - list of target
type Targets struct {
	Targets []string `json:"targets" validate:"required"`
	err     map[string]string
}

func (u *Targets) validate() (err error) {
	validate = validator.New()
	if err = validate.Struct(u); err != nil {
		return
	}
	return nil
}

func (u *Targets) extractValidationError(err error) (errs string) {
	allErrors := ""
	e := map[string]string{
		"required": " should not be empty.",
	}
	for _, errss := range err.(validator.ValidationErrors) {
		msg, ok := e[errss.Tag()]
		if ok {
			allErrors = allErrors + errss.Field() + msg + "\n"
		}
	}
	return allErrors
}

// ExtractError extract errors
func ExtractError(user User, err error) (errs string) {
	errs = user.extractValidationError(err)
	return
}

// Validate validate user
func Validate(user User) (err error) {
	if err = user.validate(); err != nil {
		return
	}
	return nil
}
