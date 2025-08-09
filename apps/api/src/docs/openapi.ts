// Minimal manually maintained OpenAPI spec fragment for core endpoints.
// This can be served as JSON at /openapi.json without adding swagger dependency.
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Trello-like POC API',
    version: '0.1.0',
    description: 'Minimal OpenAPI spec for boards, lists, cards, and AI endpoints.'
  },
  paths: {
    '/boards': {
      get: {
        summary: 'List boards',
        responses: { '200': { description: 'List of boards' } }
      },
      post: {
        summary: 'Create board',
        requestBody: { required: true },
        responses: { '201': { description: 'Created board' }, '400': { description: 'Validation error' } }
      }
    },
    '/boards/{id}': {
      get: { summary: 'Get board', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Board detail' }, '404': { description: 'Not found' } } }
    },
    '/lists': {
      post: { summary: 'Create list', responses: { '201': { description: 'Created list' }, '400': { description: 'Validation error' } } }
    },
    '/lists/reorder': {
      patch: { summary: 'Reorder lists', responses: { '200': { description: 'Updated lists' }, '400': { description: 'Validation error' } } }
    },
    '/cards': {
      post: { summary: 'Create card', responses: { '201': { description: 'Created card' }, '400': { description: 'Validation error' } } }
    },
    '/cards/reorder': {
      post: { summary: 'Reorder cards', responses: { '201': { description: 'Updated cards' }, '400': { description: 'Validation error' } } }
    },
    '/ai/chat': {
      post: { summary: 'Proxy AI chat', responses: { '200': { description: 'AI response' } } }
    },
    '/health': {
      get: { summary: 'Health check', responses: { '200': { description: 'Service health' } } }
    }
  }
};
