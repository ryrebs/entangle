// eslint-disable-next-line import/prefer-default-export
export const removeEmptyValues = data => {
  const nonEmptyFields = {};
  const isNonEmptyValues = value =>
    value !== '' && value !== undefined && value !== null;
  Object.keys(data).forEach(key => {
    if (isNonEmptyValues(data[key])) nonEmptyFields[key] = data[key];
  });
  return nonEmptyFields;
};


export const logInterceptedForDev = (data) => {
  if (process.env.NODE_ENV === "development" || process.env.REACT_NATIVE_DEBUG) console.log({ ...data })
}