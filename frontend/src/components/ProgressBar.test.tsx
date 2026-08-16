import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders correctly with given progress', () => {
    const { container } = render(<ProgressBar current={5} total={10} label="Test Progress" />);

    // Check if the label is rendered
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
    expect(screen.getByText('5 de 10')).toBeInTheDocument();

    // Check if the inner progress bar has the correct width (50%)
    const innerBar = container.querySelector('.bg-primary');
    expect(innerBar).toHaveStyle('width: 50%');
  });

  it('renders correctly with 0 progress', () => {
    const { container } = render(<ProgressBar current={0} total={10} />);
    const innerBar = container.querySelector('.bg-primary');
    expect(innerBar).toHaveStyle('width: 0%');
  });

  it('renders correctly with 100 progress', () => {
    const { container } = render(<ProgressBar current={10} total={10} />);
    const innerBar = container.querySelector('.bg-primary');
    expect(innerBar).toHaveStyle('width: 100%');
  });
});
