module tracking/backend

go 1.14

replace tracking/backend/route => ./route

replace tracking/backend/env => ./env

replace tracking/backend/docs => ./docs

replace tracking/backend/util => ./util

replace tracking/backend/db => ./db

require (
	github.com/alecthomas/template v0.0.0-20190718012654-fb15b899a751
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-playground/validator/v10 v10.2.0
	github.com/kisielk/errcheck v1.2.0 // indirect
	github.com/labstack/echo/v4 v4.1.16
	github.com/stretchr/testify v1.6.1
	github.com/swaggo/echo-swagger v1.0.0
	github.com/swaggo/swag v1.6.3
	github.com/xdg/scram v0.0.0-20180814205039-7eeb5667e42c // indirect
	github.com/xdg/stringprep v0.0.0-20180714160509-73f8eece6fdc // indirect
	go.mongodb.org/mongo-driver v1.5.1
	golang.org/x/net v0.0.0-20200425230154-ff2c4b7c35a0 // indirect
)
