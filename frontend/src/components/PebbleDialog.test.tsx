import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PebbleDialog from './PebbleDialog';

describe('PebbleDialog', () => {
  it('renders the message correctly', () => {
    const testMessage = "Hello, I am Pebble!";
    render(<PebbleDialog message={testMessage} />);

    // Check if the message is rendered
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
