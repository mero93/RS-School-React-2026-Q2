import { Component } from 'react';
import './Loader.css';

interface LoaderProps {
  isLoading: boolean;
}

class Loader extends Component<LoaderProps> {
  render() {
    const { isLoading } = this.props;

    if (!isLoading) return null;

    return (
      <div className="loader-overlay">
        <div className="spinner"></div>
        <p>Loading Comics data...</p>
      </div>
    );
  }
}

export default Loader;
