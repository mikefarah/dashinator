import React, { PropTypes } from 'react';

const Title = ({ titleText }) => {
  const showTitle = titleText && titleText.trim().length > 0;
  if (showTitle) {
    return (
      <header className='titleContainer'>
        <h1>{ titleText }</h1>
      </header>
    );
  }
  return null;
};

Title.propTypes = {
  titleText: PropTypes.string,
};

export default Title;
