exec npm run turtle build:android -t apk \
  -o releases
  --keystore-path ./releases/expokeystore/Entangle.jks \
  --keystore-alias $EXPO_KEYSTORE_ALIAS