import { Component, type ChangeEvent, type CSSProperties } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialValue: string;
  hasError: boolean
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
      <div style={styles.wrapper}>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.input}
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            placeholder="Search Star Trek Comics..."
            disabled={isLoading}
          />
          <button
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
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

const styles: { [key: string]: CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  title: {
    color: '#fff',
    fontSize: '1.8rem',
    marginBottom: '24px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  searchBar: {
    display: 'flex',
    width: '100%',
    maxWidth: '500px',
    height: '45px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
  input: {
    flex: 1,
    padding: '0 15px',
    fontSize: '16px',
    border: '1px solid #333',
    borderRadius: '4px 0 0 4px',
    backgroundColor: '#1a1d23',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '0 25px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
};

export default Search;