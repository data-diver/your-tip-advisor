import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInterface } from '../ChatInterface';

// Mock global fetch
global.fetch = jest.fn();

describe('ChatInterface', () => {
  const mockOnClose = jest.fn();
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    mockOnClose.mockClear();
    mockFetch.mockClear();
    // Default mock successful response for most tests
    // Use mockResolvedValue so it applies to all calls in a test unless overridden
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Mocked backend response from default mock" }),
    } as Response);
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
      expect(screen.getByText("Mocked backend response from default mock")).toBeInTheDocument();
    });
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

  test('displays an error message if fetching from backend fails', async () => {
    // Override default successful mock with a failed one for this specific test
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Ask for tipping advice...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    // Check that button is enabled initially
    expect(sendButton).toBeEnabled();
    expect(input).toBeEnabled();

    fireEvent.change(input, { target: { value: 'Test message for error' } });
    fireEvent.click(sendButton);

    // Check that button is disabled while loading
    // We will wait for the spinner to appear, which implies isLoading is true
    await waitFor(() => {
      expect(sendButton.querySelector('.animate-spin')).toBeInTheDocument();
      expect(input).toBeDisabled(); // Check input along with spinner
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Sorry, I couldn't connect to the AI advisor. Please try again later.")).toBeInTheDocument();
    });

    // Check that button and input are re-enabled after error, and spinner is gone
    expect(sendButton).toBeEnabled();
    expect(input).toBeEnabled();
    expect(sendButton.querySelector('.animate-spin')).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  test('displays specific error message if backend returns error status', async () => {
    // Override default successful mock with a specific error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal server error" }), // Or any other error structure
    } as Response);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Ask for tipping advice...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'Test message for backend error' } });
    fireEvent.click(sendButton);

    // Check for loading state
    await waitFor(() => {
      expect(sendButton.querySelector('.animate-spin')).toBeInTheDocument();
      expect(input).toBeDisabled(); // Check input along with spinner
    });

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText("Sorry, I couldn't connect to the AI advisor. Please try again later.")).toBeInTheDocument();
    });
    // Check that button and input are re-enabled after error
    expect(sendButton).toBeEnabled();
    expect(input).toBeEnabled();
    expect(sendButton.querySelector('.animate-spin')).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});

describe('ChatInterface Auto-scrolling', () => {
  const mockOnClose = jest.fn();
  let scrollIntoViewMock: jest.SpyInstance;

  beforeEach(() => {
    mockOnClose.mockClear();
    scrollIntoViewMock = jest.spyOn(HTMLDivElement.prototype, 'scrollIntoView').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollIntoViewMock.mockRestore();
  });

  test('scrolls to bottom when new messages are added', async () => {
    render(<ChatInterface isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Ask for tipping advice...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    // Initial render might cause a scroll if messages were pre-populated (not in this case)
    // So we clear mock calls after the initial render and before interaction
    scrollIntoViewMock.mockClear();

    // Send user message
    fireEvent.change(input, { target: { value: 'Test user message' } });
    fireEvent.click(sendButton);

    // Check if scrollIntoView was called for the user's message
    // useEffect runs after render, so it should be called once here
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

    // Wait for mock LLM response
    await waitFor(() =>
      expect(screen.getByText("Mocked backend response from default mock")).toBeInTheDocument()
    );

    // Check if scrollIntoView was called again for the LLM's message
    // The messages array updates, triggering useEffect again
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);
  });
});
