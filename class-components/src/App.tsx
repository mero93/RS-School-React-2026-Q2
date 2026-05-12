import { Component } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Results from './components/Result/Results';
import type { ApiResponse } from './types/api-response';
import { ApiService } from './services/api.service';
import Pagination from './components/Pagination/Pagination';
import Search, { searchStorageKey } from './components/Search/Search';
import Loader from './components/Loader/Loader';

interface AppProps {
  dummy?: string;
}

interface State {
  hasError: boolean;
  apiResponse: ApiResponse | undefined;
  loading: boolean;
  searchTerm: string;
  searchCount: number;
}

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);

    const savedTerm = localStorage.getItem(searchStorageKey) ?? '';

    this.state = {
      hasError: false,
      apiResponse: undefined,
      loading: false,
      searchTerm: savedTerm,
      searchCount: 0,
    };
  }

  componentDidMount() {
    this.callApi(0);
  }

  triggerError = () => {
    this.setState({ hasError: true });
  };

  handleSearch = (data: string) => {
    this.callApi(0, data);
  };

  callApi = (page: number, data?: string) => {
    let searchInput = '';

    this.setState(
      (prevState) => {
        searchInput = data ?? prevState.searchTerm;

        return { loading: true };
      },
      async () => {
        try {
          const data = await ApiService.search(searchInput, page);

          this.setState((prev) => ({
            apiResponse: data,
            loading: false,
            hasError: false,
            searchTerm: searchInput ?? prev.searchTerm,
            searchCount: prev.searchCount + 1,
          }));
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
          <Search
            onSearch={this.handleSearch}
            isLoading={this.state.loading}
            initialValue={this.state.searchTerm}
            hasError={this.state.hasError}
          />
        </section>

        <section className="results-container">
          {this.state.apiResponse && (
            <Pagination
              page={this.state.apiResponse.page}
              onPageChange={(page: number) => this.callApi(page)}
            />
          )}
          <ErrorBoundary key={this.state.searchCount}>
            <Loader isLoading={this.state.loading} />
            <Results
              hasError={this.state.hasError}
              items={this.state.apiResponse?.comicStrips}
            />
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
