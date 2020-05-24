
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCoins, faExternalLinkAlt, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import './style.sass'

export default ({ jobs }) => {
    return (
        <>
            {jobs.map((job, key) => {
                return (
                    <div className="column is-4" key={key}>
                        < div className="card" >
                            <header className="card-header">
                                <p className="card-header-title">
                                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="resultIcon">
                                        <FontAwesomeIcon icon={faExternalLinkAlt} color="blue" />
                                    </a>{job.name}
                                </p>
                                < div className="card-header-icon" aria-label="more options">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faCircle} color={job.jobColor} />
                                    </span>
                                </div>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    {job.company}
                                    <br />
                                    <FontAwesomeIcon icon={faMapMarkedAlt} color="green" />
                                    <span className="resultIcon">{job.location}</span>
                                    <br />
                                    <FontAwesomeIcon icon={faCoins} color="gold" /> {job.salary}
                                </div>
                            </div>
                        </div >
                    </div>
                )
            }
            )}
        </>
    )

} 