/**
 * Mock Service Worker (MSW) server setup for Node.js tests
 * Uncomment if you need to mock API calls in tests
 */

// import { setupServer } from 'msw/node';
// import { handlers } from './handlers';

// export const server = setupServer(...handlers);

// If not using MSW, export a dummy object
export const server = {
  listen: () => {},
  close: () => {},
  resetHandlers: () => {},
};
