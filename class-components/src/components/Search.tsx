import { Component, type ChangeEvent } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialValue: string;
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

    if (trimmedTerm === this.props.initialValue) {
      return;
    }

    localStorage.setItem(searchStorageKey, trimmedTerm);

    this.props.onSearch(trimmedTerm);
  };

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Search Star Trek characters..."
          disabled={this.props.isLoading}
        />
        <button
          onClick={this.handleSearchClick}
          disabled={this.props.isLoading}
        >
          {this.props.isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    );
  }
}

export default Search;
