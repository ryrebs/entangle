A. Build the binary:

`CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend .`

TODO: Improve architecture

1. Scheduled scraping

2.  Saved data to db

3. Fuzzifier and category , tagging before saving

4. Searching

B, Create mongodb user using admin account:

`mongo -u api -p apiuser --authenticationDatabase admin`

Create user, db and collection:

```
use jobs 
db.createCollection("locationCol")
db.createUser( {
	user:"server",
	pwd: "serverpass",
	roles: [
	  { role: "readWrite", db: "locations" },
  
	]
  }
  )
```
C. Run dev:

ENV=dev \
PORT=5000 \
SECRET_KEY=server_key \
SECRET_CLIENT_KEY=client_key \
go run ./server.go


Test token for registration contains lat, lng and signed by client secret key

	curl --header "Content-Type: application/json" \
	--request POST \
	--data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXQiOjEuMiwibG5nIjoxLjN9.5_tEKxoz9-9YVW0TjGfMR9nkMtbzLLNyw0PQKppOWO0"}' \
	http://localhost:5000/auth

Token  w/ 1yr expiration:

	curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2NjI1MzgsInN1YiI6IlwiNWVjZTQ0MGFiY2E0MmEzYTYzMzMwMzFlXCIifQ.gPkppjcOMj5N18oULgxBxFiEgfGn-u3CH0mBdadf1ME" http://localhost:5000/api/location

Expired token:

	curl --header "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTg4Nzg2NDQsInN1YiI6IlwiNWVjZTQ0MGFiY2E0MmEzYTYzMzMwMzFlXCIiLCJqdGkiOiIxMjVkZDY1MC1lMmM1LTRhYTAtYWZlNS0xYzkwNDk5M2YyYzYiLCJpYXQiOjE1OTA1ODc3NTh9.np4cqXAzhXWFXssUOb6gmtlP1qofWYr8kmFqJDDYTxE" http://localhost:5000/api/location



db.locationCol.updateOne(
      { "_id" : ObjectId("5ece4ccfbca42a3a63330320") },
      { $push: { "trackers" : "5ece440abca42a3a6333031e" } }
   );



curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM3ODMsInN1YiI6IlwiNWVjZWJlMTczZTJhMjk5ODc0MTJiNjBjXCIifQ.i_D6dwsV_rQ3_yvniUnd_RPRiVHRMtwEqLg7P0arUTA" \
--request POST \
--data '{"targets": ["5ecebe2b3e2a29987412b60d","5ecebe2b3e2a29987412b60d","5ece4dbbc51612eedaa1aa3c","5ece6f7825ab029fd54bd508"]}' \
 http://localhost:5000/api/addtarget


curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2NjI1MzgsInN1YiI6IlwiNWVjZTQ0MGFiY2E0MmEzYTYzMzMwMzFlXCIifQ.gPkppjcOMj5N18oULgxBxFiEgfGn-u3CH0mBdadf1ME" \
        --request POST \
        --data '{"lat": 1.12312323, "lng": 1.1283791}' \
http://localhost:5000/api/updatelocation



curl -X DELETE --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM3MzUsInN1YiI6IlwiNWVjZWJkZTczZTJhMjk5ODc0MTJiNjBiXCIifQ.7MIZJaG6bmqstwYQLaSQsNhxLBV2NwNuoVXciSt4QPA" http://localhost:5000/api/deletetracker


curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM4MDMsInN1YiI6IlwiNWVjZWJlMmIzZTJhMjk5ODc0MTJiNjBkXCIifQ.QhxJGwliv6HWNicBYawReJWghEbOG0CyatrLn3PyuMs" \
--request POST \
--data '{"targets": ["5ecebe173e2a29987412b60c","5ecebe2b3e2a29987412b60d","5ece4dbbc51612eedaa1aa3c","5ece6f7825ab029fd54bd508"]}' \
 http://localhost:5000/api/deletetrackerontarget



2. 5ecebe173e2a29987412b60c
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM3ODMsInN1YiI6IlwiNWVjZWJlMTczZTJhMjk5ODc0MTJiNjBjXCIifQ.i_D6dwsV_rQ3_yvniUnd_RPRiVHRMtwEqLg7P0arUTA

3. 5ecebe2b3e2a29987412b60d
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM4MDMsInN1YiI6IlwiNWVjZWJlMmIzZTJhMjk5ODc0MTJiNjBkXCIifQ.QhxJGwliv6HWNicBYawReJWghEbOG0CyatrLn3PyuMs