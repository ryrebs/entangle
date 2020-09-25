A. Build the binary:

`CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend .`

B, Create mongodb user using admin account:

`mongo -u <admin> -p <admin-pass> --authenticationDatabase admin`

Create user, db and collection:

```
use locations
db.createCollection("locationCol")
db.createUser( {
	user:"user",
	pwd: "userpass",
	roles: [
	  { role: "readWrite", db: "locations" },

	]
  }
  )
```

C. Run dev:

    ENV=dev \
    PORT=5000 \
    SECRET_KEY=JK^gshdf34LophsdJkj%%34%%\$$ui \
    SECRET_CLIENT_KEY=aUi8sd%667HyaskjAjkd22SJKcjsk@#5123%^$ go run ./server.go

D. Sample Requests

Test token for registration contains lat, lng and signed by client secret key

    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXQiOjEuMiwibG5nIjoyLjIsIk5hbWUiOiJ0ZXN0In0.jxAYJtFLDZhNjpw7Hzi_cYOtrY6Hyds5xaqUtchn2C4", "name": "rodel"}' \
    http://localhost:5000/auth

Get locations

    curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTk0OTQ2NjQsInN1YiI6IlwiNWY1NTA4ODhmNGQzODJlOWRjMzk2NTA0XCIifQ.VkKPrPjJVq4y8R3jxTQfPs66goBDnT7LGvc-KBvJLQw" http://localhost:5000/api/location

Add targets

    curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTk0OTQ2NjQsInN1YiI6IlwiNWY1NTA4ODhmNGQzODJlOWRjMzk2NTA0XCIifQ.VkKPrPjJVq4y8R3jxTQfPs66goBDnT7LGvc-KBvJLQw" \
    --request POST \
    --data '{"targets": ["5f528dae4ed7a5b2c9df0dcd"]}' \
    http://localhost:5000/location/addtarget

Update location of tracker

    curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTIyNDI0MjAsInN1YiI6IlwiNWVlNjVmNzQ4MzU3NmNhZWZjMjg2NTg0XCIifQ.Q5WmOKl0PTh0z67BsdjJdXToilDKWmnJS1ZNPsS3m6M" http://localhost:5000/api/location" \
    --request POST \
    --data '{"lat": 100.12312323, "lng": 20.1283791}' \
    http://localhost:5000/api/updatelocation

Delete tracker

    curl -X DELETE --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM3MzUsInN1YiI6IlwiNWVjZWJkZTczZTJhMjk5ODc0MTJiNjBiXCIifQ.7MIZJaG6bmqstwYQLaSQsNhxLBV2NwNuoVXciSt4QPA" http://localhost:5000/api/deletetracker

Delete trackers

    curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTM4MDMsInN1YiI6IlwiNWVjZWJlMmIzZTJhMjk5ODc0MTJiNjBkXCIifQ.QhxJGwliv6HWNicBYawReJWghEbOG0CyatrLn3PyuMs" \
    --request POST \
    --data '{"targets": ["5ecebe173e2a29987412b60c","5ecebe2b3e2a29987412b60d","5ece4dbbc51612eedaa1aa3c","5ece6f7825ab029fd54bd508"]}' \
    http://localhost:5000/api/deletetargets
