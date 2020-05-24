import { createSelector } from '@reduxjs/toolkit';


const searchMessageSelector = createSelector(
    state => state.search,
    search => {
        const { error, errorMsg, response, loading } = search['jobs/get']
        if (response)
            return {
                error,
                errorMsg: !response ? errorMsg: response.message,
                loading,
                response: response.message
            }
        else {
            return {
                error,
                errorMsg,
                response,
                loading
            }
        }
    }
)

const jobsSelector = createSelector(
    state => state.search,
    search => search['jobs/insert']

)

const clientSelector = createSelector(
    state => state.search,
    search => search['jobs/client']
)

export { searchMessageSelector, jobsSelector, clientSelector }