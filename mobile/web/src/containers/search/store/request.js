import { REQUEST_ACTION } from "../../../store/request/request.action";
import ApiService from '../../../service/api/Api.service'
import { searchReducerAction } from './reducer'

export const searchRequestAction = (client, query) => ({
    type: REQUEST_ACTION,
    method: ApiService.getApi().get,
    route: "/search?q=" + query + "&id=" + client,
    resultReducerAction: searchReducerAction,
})