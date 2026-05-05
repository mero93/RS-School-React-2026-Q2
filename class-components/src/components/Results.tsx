import { Component } from 'react';

interface ResultsProps {
  hasError: boolean;
}

class Results extends Component<ResultsProps> {
  render() {
    if (this.props.hasError) {
      throw new Error('Simulation: Results component crashed!');
    }

    return (
      <div className="results-list">
        <h3>Results Area</h3>
        <div
          className="result-item"
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            margin: '10px 0',
          }}
        >
          <strong>Item Name</strong>: Item Description
        </div>
      </div>
    );
  }
}

export default Results;
