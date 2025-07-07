import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '../Index';
import { tippingData } from '@/data/tippingData'; // For selecting a country

// Mock the ChatInterface to simplify testing and avoid its internal logic
jest.mock('@/components/ChatInterface', () => ({
  ChatInterface: jest.fn(({ isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="chat-interface">
        <span>Mocked Chat Interface</span>
        <button onClick={onClose}>Close Chat</button>
      </div>
    ) : null
  ),
}));

// Mock exchangeRates
jest.mock('@/data/exchangeRates', () => ({
  exchangeRates: {
    USD: { EUR: 0.9, JPY: 110 },
    EUR: { USD: 1.1, JPY: 120 },
    // Add other currencies as needed by tests
  },
  supportedCurrencies: [
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ]
}));


const queryClient = new QueryClient();

const renderIndexPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <Index />
      </Router>
    </QueryClientProvider>
  );
};

describe('Index Page', () => {
  test('renders initial state correctly', () => {
    renderIndexPage();
    expect(screen.getByText("Welcome to Global Tip Advisor!")).toBeInTheDocument();
    expect(screen.getByText("1. Select your home currency.")).toBeInTheDocument();
    expect(screen.getByText("2. Choose a country you're visiting.")).toBeInTheDocument();
  });

  test('allows selecting a country and displays country info and calculator', async () => {
    renderIndexPage();

    // Select a country (e.g., United States)
    // Assuming CountrySelector has a button or similar to open a dropdown/list
    // and then items to click. For simplicity, let's assume a direct selection method
    // if available, or simulate the necessary clicks.
    // This part depends heavily on CountrySelector's implementation.
    // For now, we'll focus on the chat interaction after a country is selected.

    // Select a country (e.g., United States)
    // The CountrySelector renders country buttons directly.
    // We need to ensure the CountrySelector itself is rendered.
    // Let's find the "Find Tipping Info" heading first.
    expect(screen.getByRole('heading', { name: /find tipping info/i })).toBeInTheDocument();

    // Click on the United States button. The name includes country code and symbol.
    // We'll use a regex to be more flexible.
    const usaCountryName = tippingData[0].name; // "United States"
    const countryButton = await screen.findByRole('button', { name: new RegExp(usaCountryName, "i") });
    fireEvent.click(countryButton);

    // Check if CountryInfoCard and CalculatorCard are displayed
    await waitFor(() => {
      // Check for the country name specifically within an H3, as it appears in CountryInfoCard
      expect(screen.getByRole('heading', { name: tippingData[0].name, level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /calculator/i })).toBeInTheDocument(); // From CalculatorCard
    });
  });

  describe('Chat Interface Interaction', () => {
    beforeEach(async () => {
      renderIndexPage();
      // Select a country to make the CalculatorCard and its chat button visible
      expect(screen.getByRole('heading', { name: /find tipping info/i })).toBeInTheDocument();
      const usaCountryName = tippingData[0].name; // "United States"
      const countryButton = await screen.findByRole('button', { name: new RegExp(usaCountryName, "i") });
      fireEvent.click(countryButton);
      // Ensure CalculatorCard is rendered before proceeding
      await screen.findByRole('heading', { name: /calculator/i });
    });

    test('chat interface is initially hidden', () => {
      expect(screen.queryByTestId('chat-interface')).not.toBeInTheDocument();
    });

    test('opens chat interface when "Ask AI Advisor" button is clicked', async () => {
      const openChatButton = await screen.findByRole('button', { name: /ask ai advisor/i });
      fireEvent.click(openChatButton);

      await waitFor(() => {
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
        expect(screen.getByText('Mocked Chat Interface')).toBeInTheDocument();
      });
    });

    test('closes chat interface when its close button is clicked', async () => {
      // Open the chat first
      const openChatButton = await screen.findByRole('button', { name: /ask ai advisor/i });
      fireEvent.click(openChatButton);
      await screen.findByTestId('chat-interface'); // Wait for it to open

      // Click the close button inside the mocked chat
      const closeChatButton = screen.getByRole('button', { name: /close chat/i });
      fireEvent.click(closeChatButton);

      await waitFor(() => {
        expect(screen.queryByTestId('chat-interface')).not.toBeInTheDocument();
      });
    });
  });
});
