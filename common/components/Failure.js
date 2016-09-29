import React, { Component, PropTypes } from 'react'

const Failure = ({name, url}) => (
  <li>
    <a href={ url }>
      { name }
    </a>
  </li>
)

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default Failure