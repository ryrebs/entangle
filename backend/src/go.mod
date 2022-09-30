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
	github.com/google/go-cmp v0.4.0 // indirect
	github.com/labstack/echo/v4 v4.9.0
	github.com/stretchr/testify v1.7.0
	github.com/swaggo/echo-swagger v1.0.0
	github.com/swaggo/swag v1.6.3
	go.mongodb.org/mongo-driver v1.3.3
)
