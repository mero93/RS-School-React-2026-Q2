import { Component } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Results from './components/Results';
import type { ApiResponse } from './types/api-response';
import { ApiService } from './services/api.service';

interface AppProps {
  dummy?: string;
}

interface State {
  hasError: boolean;
  apiResponse: ApiResponse | undefined;
  loading: boolean;
  searchTerm: string;
}

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      hasError: false,
      apiResponse: undefined,
      loading: false,
      searchTerm: '',
    };
  }

  triggerError = () => {
    this.setState({ hasError: true });
  };

  handleSearch = () => {
    this.callApi(7);
  };

  callApi = (page: number) => {
    let storedSearchTerm = '';
    this.setState(
      (prevState) => {
        storedSearchTerm = prevState.searchTerm;
        return { loading: true };
      },
      async () => {
        try {
          const data = await ApiService.search(storedSearchTerm, page);

          console.log('STAPI Full Response:', data);

          this.setState({
            apiResponse: data,
            loading: false,
          });
        } catch (error) {
          console.error('API Error:', error);
          this.setState({
            loading: false,
            hasError: true,
          });
        }
      }
    );
  };

  render() {
    return (
      <div className="app-wrapper">
        <section className="search-container">
          <h2>Search Section</h2>
          <button onClick={this.handleSearch} className="error-btn">
            Api Call
          </button>
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
