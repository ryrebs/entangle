import Centrifuge from 'centrifuge'
import { searchJobInsertAction, storeClientAction } from '../../containers/search/store/reducer';
import { API_HOST } from '../api';
import axios from 'axios';
import { logInterceptedForDev } from '../../utils/data.util';

const CENTRIFUGO_DEV_HOST = "localhost:8000"
const WS_SCHEME = process.env.NODE_ENV === "development" ? "ws://" : "wss://"
const CENTRIFUGO_ROUTE = process.env.NODE_ENV === "development" ? "/connection/websocket" : "/centrifugo"
const CENTRIFUGO_HOST = process.env.NODE_ENV === "development" ? CENTRIFUGO_DEV_HOST : process.env.REACT_APP_CENTRIFUGO_HOST
const CENTRIFUGO_ANONYMOUS_USER = process.env.REACT_APP_CENTRIFUGO_ANONYMOUS_USER || "iJIUzI1NiIsInR5cCI6IkpXVCJ9"
const HOST = WS_SCHEME + CENTRIFUGO_HOST + CENTRIFUGO_ROUTE

const axiosApi = axios.create({
    baseURL: API_HOST,
    timeout: 40000,
});
axiosApi.defaults.headers.common.Accept = 'application/json; charset=utf-8';
logInterceptedForDev({ API_HOST, HOST })
export default async store => {
    var clientId = null
    const centrifuge = new Centrifuge(HOST, {
        debug: process.env.NODE_ENV === "development" ? true : false,
        onRefresh: async (ctx, cb) => {
            try {
                const res = await axiosApi.post("/centrifuge/refresh", {
                    id: clientId,
                })
                const { data } = res
                cb(data)
            } catch (error) {
                console.log(error)
            }
        }
    });
    try {
        const resp = await axiosApi.post("/auth", {
            name: CENTRIFUGO_ANONYMOUS_USER,
        })
        if (resp != null && resp.hasOwnProperty("data")) {
            const { token } = resp.data
            centrifuge.setToken(token)
            centrifuge.on('connect', function (context) {
                const { client } = context
                clientId = client
                logInterceptedForDev({ client })
                store.dispatch(storeClientAction({ client }))
                centrifuge.subscribe(client, function (message) {
                    const { data } = message
                    logInterceptedForDev(data)
                    // TODO: Pagination
                    store.dispatch(searchJobInsertAction({ jobs: data }))
                });
            });
            centrifuge.connect()
        }
    } catch (error) {
        console.log(error)
    }
}