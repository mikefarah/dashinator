import React, { Component, PropTypes } from 'react'
import FailureList from './FailureList'

const Dashboard = ({connection, testEnvironments}) => (
  <div class={ connection }>
    { connection }
    <FailureList failures={ testEnvironments } name='Test Environments' />
  </div>
)

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  dashboard: PropTypes.shape({

  }).isRequired,
}

export default Dashboard