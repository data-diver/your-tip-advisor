import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInterface } from '../ChatInterface';

describe('ChatInterface', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders nothing when isOpen is false', () => {
    render(<ChatInterface isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders chat when isOpen is true', () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Chat with Tip Advisor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask for tipping advice...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('allows user to type and send a message', () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Ask for tipping advice...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'Hello there!' } });
    expect(input).toHaveValue('Hello there!');
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input should clear after sending
  });

  test('displays user message and mock LLM response', async () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Ask for tipping advice...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Wait for the mock LLM response
    await waitFor(() => {
      expect(screen.getByText("This is a mock LLM response. I'll be able to provide more helpful advice soon!")).toBeInTheDocument();
    }, { timeout: 1500 }); // Timeout should be longer than the setTimeout in component
  });

  test('does not send message if input is empty', () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);
    // Check that no new messages appeared (other than potential initial ones if any)
    // Here, we expect only the title to be present, no messages yet.
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument(); // Assuming messages are list items or similar
    // A more robust check would be to count messages before and after,
    // but for this case, checking for any message content is sufficient.
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    expect(screen.queryByText("This is a mock LLM response. I'll be able to provide more helpful advice soon!")).not.toBeInTheDocument();

  });
});
