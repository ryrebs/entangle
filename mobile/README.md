Setup

A. Update .env file

B. Building apk

Android: `expo build:android -t apk`

Signing:

### Option 1:

Let expo generate the keystore for you. It contains the signing key and upload key

On the first build, if you choose "let expo handle it for you", fetch the keystore:

`expo fetch:android:keystore`

Extract your upload cert in to a .pem file:

`expo fetch:android:upload-cert`

_Clearing expo keystore: `expo build:android --clear-credentials`_

### Option 2:

Create your own keystore.

```keytool -genkey -v -keystore \
   <keystore-name>.keystore \
   -alias <keystore-alias> \
   -keyalg RSA -keysize 2048 -validity 10000
```

Create upload key:

```
keytool -export -rfc \
  -keystore <keystore-name>keystore \
  -alias <keystore-alias> \
  -file entangle_upload_cert.pem \
```

### Option 3:

Create your own keystore and your upload key and let google play handle app signing key for you. (Recommended)
