import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /to get started, edit the page\.tsx file/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders the Deploy Now link', () => {
    render(<Home />);

    const deployLink = screen.getByRole('link', { name: /deploy now/i });

    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute('target', '_blank');
  });

  it('renders the Documentation link', () => {
    render(<Home />);

    const docsLink = screen.getByRole('link', { name: /documentation/i });

    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href');
  });
});
