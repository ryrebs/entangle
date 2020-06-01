import axios from 'axios';
import {
  successResponseInterceptor,
  errorResponseInterceptor,
} from './api.interceptors';
import api from './Api.service';

const TIMEOUT = 300 * 1000;
const DEV_HOST = "localhost:5000"
const SCHEME = process.env.NODE_ENV === "development" ? "http://" : "https://"
const DOMAIN = process.env.REACT_APP_API_URL || DEV_HOST

export const API_HOST = SCHEME + DOMAIN
export const createAxiosInstance = (url) => {
  const axiosApi = axios.create({
    baseURL: url,
    timeout: TIMEOUT,
  });
  axiosApi.interceptors.response.use(
    successResponseInterceptor,
    errorResponseInterceptor,
  );
  axiosApi.defaults.headers.common.Accept = 'application/json; charset=utf-8';
  return axiosApi;
};

const setBearerToken = apiInst => {
  // eslint-disable-next-line no-param-reassign
  apiInst.defaults.headers.common.Authorization = '<set bearer here..>';
};

export default () => {
  api.initialize(createAxiosInstance(API_HOST));
  setBearerToken(api.getApi().apiInst);
};
