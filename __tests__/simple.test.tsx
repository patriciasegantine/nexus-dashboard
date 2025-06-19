import { render, screen } from '@testing-library/react';

// Simple component to test if Jest is working
function SimpleComponent() {
  return <div>Hello World</div>;
}

describe('SimpleComponent', () => {
  it('should render "Hello World"', () => {
    render(<SimpleComponent/>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
