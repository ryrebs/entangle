package db

import (
	"context"
	"log"
	"os"
	"strings"
	"time"
	"tracking/backend/util"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

// ObjectID - return a struct type ObjectID
type ObjectID struct {
	ID primitive.ObjectID `bson:"_id"`
}

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

// FindOne - find one document
func FindOne(filter interface{}, cl *mongo.Collection) (bson.M, error) {
	opts := options.FindOne()
	f, errf := bson.Marshal(filter)
	if errf != nil {
		return nil, errf
	}
	var result bson.M
	err := cl.FindOne(context.TODO(), f, opts).Decode(&result)
	if err != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if err == mongo.ErrNoDocuments {
			return nil, err
		}
		util.LogInDev("ERR:FindOne", err.Error())
		return nil, err
	}
	return result, nil
}

// FindOneAndUpdate - find and update a document
func FindOneAndUpdate(setChanges interface{}, filter interface{}, cl *mongo.Collection) (bson.M, error) {
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	c, errc := bson.Marshal(setChanges)
	if errc != nil {
		return nil, errc
	}
	f, errf := bson.Marshal(filter)
	if errf != nil {
		return nil, errf
	}
	var updatedDocument bson.M
	err := cl.FindOneAndUpdate(context.TODO(), f, c, opts).Decode(&updatedDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			util.LogInDev("ERR:ErrNoDocuments", err.Error())
			return nil, err
		}
		util.LogInDev("ERR:setTrackerExpiredStatus", err.Error())
		return nil, err
	}
	util.LogInDev("UPDATED", updatedDocument)
	return updatedDocument, nil
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
		util.LogInDev("ERR:DeleteMany", err.Error())
	}
	util.LogInDev("RES:DeleteMany", res)
}

// CreateObjectID - create primitive objectID from string
func CreateObjectID(id string) (objID *ObjectID) {
	oid, _ := primitive.ObjectIDFromHex(strings.ReplaceAll(id, "\"", ""))
	objID = &ObjectID{ID: oid}
	return
}
