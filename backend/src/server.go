package main

import (
	"os"
	"tracking/backend/db"
	_ "tracking/backend/docs"
	"tracking/backend/route"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title TrackingTarget API docs
// @version 0.1.0
// @description Backend server for the TrackingTarget
// @tag.name Auth
// @tag.description user authentication operations
// @termsOfService http://swagger.io/terms/
// @BasePath /
func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Secure())
	e.Use(middleware.CORS())
	e.Use(route.ValidateAPIRequest)

	db.InitDBClient()

	if os.Getenv("ENV") != "production" {
		e.GET("/swagger/*", echoSwagger.WrapHandler)
	}

	route.Register(e)
	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
