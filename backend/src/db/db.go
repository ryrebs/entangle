package db

import (
	"context"
	"log"
	"os"
	"time"
	"tracking/backend/util"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Client - client connection
var Client *mongo.Client

// LocationCollection - return location collection
const LocationCollection = "locationCol"

// LocationDb - location db string
const LocationDb = "locations"

var collection *mongo.Collection

// InitDBClient - returns the collection
func InitDBClient() {
	var err error

	URI := os.Getenv("MONGODB")
	if URI == "" {
		URI = "mongodb://server:serverpass@127.0.0.1:27017/" + LocationDb
	}
	util.LogInDev("Creating Client", URI)
	clientOpts := options.Client().ApplyURI(URI)
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	Client, err = mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatalln(err)
	}
	defer cancel()
}

// GetDefaultClient - get a collection
func GetDefaultClient() *mongo.Client {
	if Client == nil {
		util.LogInDev("No Client", "")
		InitDBClient()
		return Client
	}
	util.LogInDev("Client Exists", "")
	return Client
}

// InsertOne - insert one
func InsertOne(item interface{}, col *mongo.Collection) interface{} {
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	res, err := col.InsertOne(ctx, item)
	if err != nil {
		util.LogInDev("COLLECTION INSERT", err.Error())
		return nil
	}
	id := res.InsertedID
	return id
}

// InsertMany - insert many
func InsertMany(items []interface{}, col *mongo.Collection) {
	opts := options.InsertMany().SetOrdered(false)
	ctx, cancel := context.WithCancel(context.Background())
	col.InsertMany(ctx, items, opts)
	defer cancel()
}

// DeleteMany - delete many
func DeleteMany(filter interface{}, collection *mongo.Collection) {
	filterBson, _ := bson.Marshal(filter)
	opts := options.Delete().SetCollation(&options.Collation{
		Locale: "en_US",
	})
	res, err := collection.DeleteMany(context.TODO(), filterBson, opts)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(res)
}
