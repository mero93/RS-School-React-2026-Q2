import { Component } from 'react';

interface LoaderProps {
  isLoading: boolean;
}

class Loader extends Component<LoaderProps> {
  render() {
    const { isLoading } = this.props;

    if (!isLoading) return null;

    return (
      <div className="loader-overlay" style={overlayStyle}>
        <div className="spinner" style={spinnerStyle}></div>
        <p>Loading Comics data...</p>
      </div>
    );
  }
}

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  padding: '50px',
  backdropFilter: 'blur(6px)',
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default Loader;
