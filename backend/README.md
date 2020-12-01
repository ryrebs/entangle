A. Build the binary:

`CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend .`

B. Create mongodb user using admin account:

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

C. Run dev (Replace dev keys with prod secret keys):

    ENV=dev \
    PORT=5000 \
    SECRET_KEY=JK^gshdf34LophsdJkj%%34%%\$$ui \
    SECRET_CLIENT_KEY=aUi8sd%667HyaskjAjkd22SJKcjsk@#5123%^$ go run ./server.go

D. Run docs server (wip)

---

**Sample Requests:**

Test token for registration contains lat, lng and signed by client secret key

    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJsYXQiOjE1MTYyMzkwMjIsImxuZyI6MX0.i7PQR48VJAClkce7QbZK9G15yTNfiMDgwkxCBgZxFGo", "name": "rodel"}' \
    http://localhost:5000/auth

Get locations

    curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDY2NTgyODEsInN1YiI6IlwiNWZjMjU3NjkxMWRjNzdmMWQzYTNmYjc5XCIifQ.zSeoRtwIfmsTNadnauy8msPV6FSZiEE-7tbHgdWDQO0" http://localhost:5000/location/fetch

Add targets

    curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDY2ODAxNjAsInN1YiI6IlwiNWZjMmFjZTAxMWRjNzdmMWQzYTNmYjdhXCIifQ.xL67o2htUjragf78nnFuS_TQxA-6ndcPl8hXqSoa8RQ" \
    --request POST \
    --data '{"targets": ["5f55193e93f7a31246b1f0b4"]}' \
    http://localhost:5000/location/addtarget

Update location of tracker

    curl --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTIyNDI0MjAsInN1YiI6IlwiNWVlNjVmNzQ4MzU3NmNhZWZjMjg2NTg0XCIifQ.Q5WmOKl0PTh0z67BsdjJdXToilDKWmnJS1ZNPsS3m6M" http://localhost:5000/api/location" \
    --request POST \
    --data '{"lat": 100.12312323, "lng": 20.1283791}' \
    http://localhost:5000/api/updatelocation

Delete tracker

    curl -X DELETE --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDY2NTgyODEsInN1YiI6IlwiNWZjMjU3NjkxMWRjNzdmMWQzYTNmYjc5XCIifQ.zSeoRtwIfmsTNadnauy8msPV6FSZiEE-7tbHgdWDQO0" http://localhost:5000/location/deletetracker

Delete targets

    curl --header "Content-Type: application/json" --header "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDY3MTkxNDksInN1YiI6IlwiNWZjMmFjZTAxMWRjNzdmMWQzYTNmYjdhXCIifQ.2Zkt-9w7BnYjoTZOS1m85wWBzpPAjNjDDPTDiz6GpfE" \
    --request POST \
    --data '{"targets": ["5f5510d693f7a31246b1f0b0"]}' \
    http://localhost:5000/location/deletetarget

Refresh token

    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDY2NTgyODEsInN1YiI6IlwiNWZjMjU3NjkxMWRjNzdmMWQzYTNmYjc5XCIifQ.zSeoRtwIfmsTNadnauy8msPV6FSZiEE-7tbHgdWDQO0", "name": "rodel"}' \
    http://localhost:5000/auth/refresh
