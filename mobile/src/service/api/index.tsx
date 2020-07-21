import axios, { AxiosInstance } from "axios";
import {
  successResponseInterceptor,
  errorResponseInterceptor,
} from "./api.interceptors";
import api from "./Api.service";
import Constants from "expo-constants";

const TIMEOUT = 300 * 1000;

export const API_HOST = Constants.manifest.extra.EXPO_API;

export const createAxiosInstance = (url: string) => {
  const axiosApi = axios.create({
    baseURL: url,
    timeout: TIMEOUT,
  });
  axiosApi.interceptors.response.use(
    successResponseInterceptor,
    errorResponseInterceptor
  );
  axiosApi.defaults.headers.common.Accept = "application/json; charset=utf-8";
  return axiosApi;
};

const setBearerToken = (apiInst: AxiosInstance) => {
  // eslint-disable-next-line no-param-reassign
  apiInst.defaults.headers.common.Authorization = "<set bearer here..>";
};

export default () => {
  api.initialize(createAxiosInstance(API_HOST));
  setBearerToken(api.getApi());
};

export { api as ApiService };
