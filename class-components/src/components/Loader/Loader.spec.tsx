import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';

describe('Loader Component', () => {
  it('should not render when isLoading is false', () => {
    const { container } = render(<Loader isLoading={false} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render the spinner and loading text when isLoading is true', () => {
    render(<Loader isLoading={true} />);

    const loadingText = screen.getByText(/loading comics data.../i);
    expect(loadingText).toBeInTheDocument();

    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
