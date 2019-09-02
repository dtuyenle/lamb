import React, { Component } from 'react';
import PropTypes from 'prop-types';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClient: false,
    };
  }

  componentDidMount() {
    // Let the app know it is on the client/browser
    this.setState({ isClient: true });
  }

  render() {
    const { pageData, statusCode } = this.props;
    if (statusCode > 200) {
      return <p>{statusCode}</p>;
    }
    return <p>{JSON.stringify(pageData)}</p>;
  }
}

App.propTypes = {
  pageData: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  statusCode: PropTypes.number,
};

App.defaultProps = {
  statusCode: null,
};

export default App;
