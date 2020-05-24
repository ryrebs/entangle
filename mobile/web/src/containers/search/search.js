
import React, { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import './style.sass'
import SearchResult from './searchResult/searchResult'
import { useDispatch, useSelector } from 'react-redux'
import { searchRequestAction } from './store/request'
import { searchMessageSelector, jobsSelector, clientSelector } from './store/selector'
import { logInterceptedForDev } from '../../utils/data.util'

const Search = () => {
    const dispatch = useDispatch()
    const [searchValue, setSearchValue] = useState(null)
    const { error, errorMsg, loading, response } = useSelector(searchMessageSelector)
    const clientId = useSelector(clientSelector)
    const jobs = useSelector(jobsSelector)
    const searchInputHandler = useCallback(e => setSearchValue(e.target.value), [])
    const submitHandler = useCallback(() => {
        logInterceptedForDev({ clientId, searchValue })
        if (clientId && searchValue && searchValue !== "") dispatch(searchRequestAction(clientId, searchValue))
    }, [searchValue, clientId, dispatch])
    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-5 is-12-mobile">
                    <h1 className="title is-3 jobsearch_text is-4-mobile ">Just a Simple Job Search</h1>
                </div>
            </div>
            <div className="columns is-centered is-variable is-1 is-desktop">
                <div className="column is-6 is-12-mobile">
                    <div className="control has-icons-left">
                        <input className="input is-medium" onChange={searchInputHandler} type="text" placeholder="Job Name or Position" />
                        <span className="icon is-large is-left" style={{
                            padding: '10px'
                        }}>
                            <FontAwesomeIcon className="has-text-info" icon={faBriefcase} size="lg" color="black" />
                        </span>
                    </div>
                </div>
                <div className="column is-1">
                    {loading ?
                        <button className="button is-medium  is-loading is-fullwidth" /> :
                        <button onClick={submitHandler} className="button is-medium  is-fullwidth">
                            <FontAwesomeIcon icon={faSearch} color="gray" />
                        </button>
                    }
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-5 is-12-mobile">
                    {error ? <h1 className="title is-6 jobsearch_text is-4-mobile has-text-danger">{errorMsg}</h1> : null}
                </div>
            </div>
            <div className="columns is-variable is-multiline  is-centered">
                {jobs.length > 0 ? <SearchResult jobs={jobs} /> :
                    <span className="title is-6 is-12">
                        <h1>No Results...</h1>
                    </span>}

            </div>
            <div className="columns is-variable is-multiline  is-centered">
                <span className="title is-6 is-12">
                    <h1>{response}</h1>
                </span>
            </div>
        </div>
    )
}


export default Search