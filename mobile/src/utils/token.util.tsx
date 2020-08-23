import JWT from "expo-jwt";
import Constants from "expo-constants";

export default (lat: string, lng: string) => {
  const latIsValid = lat !== null && lat !== undefined;
  const lngIsValid = lng !== null && lng !== undefined;
  const keyIsValid =
    Constants.manifest.extra.EXPO_CLIENT_API !== undefined &&
    Constants.manifest.extra.EXPO_CLIENT_API !== "";

  if (latIsValid && lngIsValid && keyIsValid)
    return JWT.encode({ lat, lng }, Constants.manifest.extra.EXPO_CLIENT_API, {
      algorithm: "HS256",
    });
  return null;
};
