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

	// Secure requests activity on location routes
	locationGroup := e.Group("/location", route.ValidateAPIRequest())
	
	// Init a db
	db.InitDBClient()

	// Include docs on dev
	if os.Getenv("ENV") != "prod" {
		e.GET("/swagger/*", echoSwagger.WrapHandler)
	}

	// Register all routes
	route.Register(e, locationGroup)

	// Start the server
	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
