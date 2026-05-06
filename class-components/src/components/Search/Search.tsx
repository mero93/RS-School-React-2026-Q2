import { Component, type ChangeEvent } from 'react';
import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialValue: string;
  hasError: boolean;
}

interface SearchState {
  inputValue: string;
}

export const searchStorageKey = 'search_term';

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.initialValue,
    };
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.setState({ inputValue: this.props.initialValue });
    }
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearchClick = () => {
    const trimmedTerm = this.state.inputValue.trim();
    if (trimmedTerm === this.props.initialValue && !this.props.hasError) return;

    localStorage.setItem(searchStorageKey, trimmedTerm);
    this.props.onSearch(trimmedTerm);
  };

  render() {
    const { isLoading } = this.props;

    return (
      <div className="search-wrapper">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            placeholder="Search Star Trek Comics..."
            disabled={isLoading}
          />
          <button
            className="search-button"
            onClick={this.handleSearchClick}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </div>
      </div>
    );
  }
}

export default Search;
