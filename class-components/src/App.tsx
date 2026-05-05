import { Component } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Results from './components/Results';

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
    return (
      <div className="app-wrapper">
        <section className="search-container">
          <h2>Search Section</h2>
        </section>

        <section className="results-container">
          <h2>Results Section</h2>
          <ErrorBoundary>
            <Results hasError={this.state.hasError} />
          </ErrorBoundary>
        </section>

        <button onClick={this.triggerError} className="error-btn">
          Trigger Error
        </button>
      </div>
    );
  }
}

export default App;
