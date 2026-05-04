import { Component } from 'react';
import './App.css';

interface AppProps {
  dummy?: string;
}

interface State {
  hasError: boolean;
}

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  triggerError = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('User-triggered crash');
    }

    return (
      <div className="app-wrapper">
        <section className="search-container">
          <h2>Search Section</h2>
        </section>

        <section className="results-container">
          <h2>Results Section</h2>
        </section>

        <button onClick={this.triggerError} className="error-btn">
          Trigger Crash
        </button>
      </div>
    );
  }
}

export default App;
