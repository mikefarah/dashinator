import React, { Component, PropTypes } from 'react'
import Failure from './Failure'

const FailureList = ({name, connection, failures}) => (
  <div>
    { connection }
    <p>
      { name }
    </p>
    <ul>
      { failures.map(f => <Failure key={ f.url } name={ f.name } url={ f.url } />) }
    </ul>
  </div>
)

FailureList.propTypes = {
  connection: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  failures: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
}

export default FailureList