import Constants from "expo-constants";

// eslint-disable-next-line import/prefer-default-export
export const removeEmptyValues = (data) => {
  const nonEmptyFields = {};
  const isNonEmptyValues = (value) =>
    value !== "" && value !== undefined && value !== null;
  Object.keys(data).forEach((key) => {
    if (isNonEmptyValues(data[key])) nonEmptyFields[key] = data[key];
  });
  return nonEmptyFields;
};

export const logInterceptedForDev = (data) => {
  if (Constants.manifest.extra.EXPO_ENV === "dev") console.log({ ...data });
};
