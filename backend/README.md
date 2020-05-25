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