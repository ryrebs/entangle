package route

import (
	"context"
	"net/http"
	"strings"
	"tracking/backend/db"
	"tracking/backend/util"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type target struct {
	ID         string  `json:"_id"`
	LastUpdate string  `json:"lastUpdate"`
	Lat        float64 `json:"lat"`
	Lng        float64 `json:"lng"`
}

var errorResponse = Response{
	Status:  http.StatusBadRequest,
	Message: "Bad request",
	Data:    nil,
}

// LocationHandler - handles get location request
func LocationHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	result := []target{}
	if trackerID != nil || trackerID != "" {
		tID := strings.ReplaceAll(trackerID.(string), "\"", "")
		opts := options.Find()
		cursor, err := LocationCollection.Find(context.TODO(), bson.M{"trackers": tID}, opts)
		if err != nil {
			util.LogInDev("ERR:LocationHandler", err.Error())
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			util.LogInDev("ERR:LocationHandler", err.Error())
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
		for _, res := range results {
			objectIDStr, _ := res["_id"].(primitive.ObjectID).MarshalJSON()
			result = append(result, target{
				ID:         strings.ReplaceAll(string(objectIDStr), "\"", ""),
				LastUpdate: res["lastUpdate"].(string),
				Lat:        res["lat"].(float64),
				Lng:        res["lng"].(float64),
			})
		}
	}
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "targets",
		Data:    result,
	})
}

// AddTargetHandler - add targets minimum 1, array of targets
func AddTargetHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	result := []target{}
	user := &Targets{}
	invalidRequest := Response{
		Message: "Invalid request",
		Status:  http.StatusBadRequest,
		Data:    nil,
	}
	if err = c.Bind(user); err != nil {
		return
	}
	if err = Validate(user); err != nil {
		msg := ExtractError(user, err)
		util.LogInDev("ERR:updateTrackerLocationHandler", msg)
		return c.JSON(http.StatusBadRequest, invalidRequest)
	}

	if trackerID != nil || trackerID != "" {
		for _, t := range user.Targets {
			changes := struct{ Trackers string }{Trackers: strings.ReplaceAll(trackerID.(string), "\"", "")}
			filter := db.CreateObjectID(t)
			setChanges := struct {
				Set interface{} `bson:"$addToSet"`
			}{
				Set: changes,
			}
			doc, err := db.FindOneAndUpdate(setChanges, filter, LocationCollection)
			if err != nil {
				util.LogInDev("ERR:AddTargetHandler: "+trackerID.(string), err.Error())
			} else {
				objectIDStr, _ := doc["_id"].(primitive.ObjectID).MarshalJSON()
				result = append(result, target{
					ID:         strings.ReplaceAll(string(objectIDStr), "\"", ""),
					LastUpdate: doc["lastUpdate"].(string),
					Lat:        doc["lat"].(float64),
					Lng:        doc["lng"].(float64),
				})
			}
		}
	}
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "Added targets",
		Data:    result,
	})
}

func updateTrackerLocationHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	user := &UpdateLocation{}
	invalidRequest := Response{
		Message: "Invalid request",
		Status:  http.StatusBadRequest,
		Data:    nil,
	}
	if err = c.Bind(user); err != nil {
		return
	}
	if err = Validate(user); err != nil {
		msg := ExtractError(user, err)
		util.LogInDev("ERR:updateTrackerLocationHandler", msg)
		return c.JSON(http.StatusBadRequest, invalidRequest)
	}
	if trackerID != nil || trackerID != "" {
		tID := strings.ReplaceAll(trackerID.(string), "\"", "")
		filter := db.CreateObjectID(tID)
		setChanges := struct {
			Set interface{} `bson:"$set"`
		}{
			Set: user,
		}
		_, err := db.FindOneAndUpdate(setChanges, filter, LocationCollection)
		if err != nil {
			util.LogInDev("ERR:updateTrackerLocationHandler", err.Error())
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
	}
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "Updated",
		Data:    nil,
	})
}

// TODO: implement

// TrackerDeleteHandler - deletes the tracker
func TrackerDeleteHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	if trackerID != "" || trackerID != nil {
		tID := strings.ReplaceAll(trackerID.(string), "\"", "")
		filter := db.CreateObjectID(tID)
		// delete at most one document in which the "name" field is "Bob" or "bob"
		// specify the SetCollation option to provide a collation that will ignore case for string comparisons
		opts := options.Delete().SetCollation(&options.Collation{
			Locale:    "en_US",
			Strength:  1,
			CaseLevel: false,
		})
		_, err := LocationCollection.DeleteOne(context.TODO(), filter, opts)
		if err != nil {
			util.LogInDev("ERR:TrackerDeleteHandler", err.Error())
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
		go deleteTrackerOnTarget(tID)
	}
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "Deleted",
		Data:    trackerID,
	})
}

func deleteTrackerOnTarget(id string) {
	filter := bson.D{{"trackers", id}}
	update := bson.D{{"$pull", bson.D{{"trackers", id}}}}
	_, err := LocationCollection.UpdateMany(context.TODO(), filter, update)
	if err != nil {
		util.LogInDev("ERR:deleteTrackerOnTarget", err.Error())
	}
	util.LogInDev("deleteTrackerOnTargetdeleteTrackerOnTarget", "DONE")
}

// TODO: implement

// TargetDeleteHandler - remove target from db, array of targets
func TargetDeleteHandler(c echo.Context) (err error) {
	trackerID := c.Get(TrackerID)
	user := &Targets{}
	invalidRequest := Response{
		Message: "Invalid request",
		Status:  http.StatusBadRequest,
		Data:    nil,
	}
	if err = c.Bind(user); err != nil {
		return
	}
	if err = Validate(user); err != nil {
		msg := ExtractError(user, err)
		util.LogInDev("ERR:updateTrackerLocationHandler", msg)
		return c.JSON(http.StatusBadRequest, invalidRequest)
	}
	if trackerID != nil || trackerID != "" {
		tID := strings.ReplaceAll(trackerID.(string), "\"", "")
		filter := db.CreateObjectID(tID)
		changes := struct {
			Trackers struct {
				In []string `bson:"$in"`
			}
		}{Trackers: struct {
			In []string `bson:"$in"`
		}{In: user.Targets}}
		update := struct {
			Set interface{} `bson:"$pull"`
		}{
			Set: changes,
		}
		_, err := LocationCollection.UpdateMany(context.TODO(), filter, update)
		if err != nil {
			util.LogInDev("ERR:TargetDeleteHandler", err.Error())
			return c.JSON(http.StatusBadRequest, errorResponse)
		}
	}
	return c.JSON(http.StatusOK, Response{
		Status:  http.StatusOK,
		Message: "Deleted",
		Data:    user.Targets,
	})
}
