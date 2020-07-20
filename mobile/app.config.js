import "dotenv/config";

const extractEnv = () => {
  if (process.env.EXPO_ENV === "dev") {
    return {
      EXPO_API: process.env.EXPO_LOCAL_API,
      EXPO_ENV: process.env.EXPO_ENV,
    };
  } else {
    return {
      EXPO_API: process.env.EXPO_PROD_API,
      EXPO_ENV: process.env.EXPO_ENV,
    };
  }
};

export default {
  name: "Entangle",
  version: "1.0.0",
  extra: extractEnv(),
};
