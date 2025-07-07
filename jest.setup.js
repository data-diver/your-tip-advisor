// In your own jest-setup.js (or any other name)
import '@testing-library/jest-dom';

// Mock scrollIntoView for all HTML elements in the JSDOM environment
if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}
