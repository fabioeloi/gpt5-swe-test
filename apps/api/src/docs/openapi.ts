// Minimal manually maintained OpenAPI spec fragment for core endpoints.
// This can be served as JSON at /openapi.json without adding swagger dependency.
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Trello-like POC API',
    version: '0.1.0',
    description: 'Minimal OpenAPI spec for boards, lists, cards, and AI endpoints.'
  },
  components: {
    schemas: {
      Board: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          ownerId: { type: 'string', nullable: true },
          lists: { type: 'array', items: { $ref: '#/components/schemas/List' } }
        }
      },
      List: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          position: { type: 'integer' },
          boardId: { type: 'string' },
          cards: { type: 'array', items: { $ref: '#/components/schemas/Card' } }
        }
      },
      Card: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          position: { type: 'integer' },
          listId: { type: 'string' }
        }
      },
      CreateBoardInput: {
        type: 'object',
        required: ['title'],
        properties: { title: { type: 'string' }, ownerId: { type: 'string' } }
      },
      CreateListInput: {
        type: 'object',
        required: ['boardId', 'title'],
        properties: { boardId: { type: 'string' }, title: { type: 'string' } }
      },
      ReorderListsInput: {
        type: 'object',
        required: ['boardId', 'orderedIds'],
        properties: { boardId: { type: 'string' }, orderedIds: { type: 'array', items: { type: 'string' } } }
      },
      CreateCardInput: {
        type: 'object',
        required: ['listId', 'title'],
        properties: { listId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } }
      },
      ReorderCardsInput: {
        type: 'object',
        required: ['source'],
        properties: {
          source: {
            type: 'object',
            required: ['listId', 'orderedIds'],
            properties: { listId: { type: 'string' }, orderedIds: { type: 'array', items: { type: 'string' } } }
          },
          dest: {
            type: 'object',
            properties: { listId: { type: 'string' }, orderedIds: { type: 'array', items: { type: 'string' } } }
          }
        }
      },
      AiChatRequest: {
        type: 'object',
        properties: {
          messages: { type: 'array', items: { type: 'object', properties: { role: { type: 'string' }, content: { type: 'string' } } } },
          max_tokens: { type: 'integer' },
          temperature: { type: 'number' }
        }
      }
    }
  },
  paths: {
    '/boards': {
      get: {
        summary: 'List boards',
        responses: { '200': { description: 'List of boards', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Board' } } } } } }
      },
      post: {
        summary: 'Create board',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBoardInput' } } } },
        responses: { '201': { description: 'Created board', content: { 'application/json': { schema: { $ref: '#/components/schemas/Board' } } } }, '400': { description: 'Validation error' } }
      }
    },
    '/boards/{id}': {
      get: { summary: 'Get board', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Board detail', content: { 'application/json': { schema: { $ref: '#/components/schemas/Board' } } } }, '404': { description: 'Not found' } } }
    },
    '/lists': {
      post: { summary: 'Create list', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateListInput' } } } }, responses: { '201': { description: 'Created list', content: { 'application/json': { schema: { $ref: '#/components/schemas/List' } } } }, '400': { description: 'Validation error' } } }
    },
    '/lists/reorder': {
      patch: { summary: 'Reorder lists', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReorderListsInput' } } } }, responses: { '200': { description: 'Updated lists', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/List' } } } } }, '400': { description: 'Validation error' } } }
    },
    '/cards': {
      post: { summary: 'Create card', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCardInput' } } } }, responses: { '201': { description: 'Created card', content: { 'application/json': { schema: { $ref: '#/components/schemas/Card' } } } }, '400': { description: 'Validation error' } } }
    },
    '/cards/reorder': {
      post: { summary: 'Reorder cards', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReorderCardsInput' } } } }, responses: { '201': { description: 'Updated cards' }, '400': { description: 'Validation error' } } }
    },
    '/ai/chat': {
      post: { summary: 'Proxy AI chat', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AiChatRequest' } } } }, responses: { '200': { description: 'AI response' } } }
    },
    '/health': {
      get: { summary: 'Health check', responses: { '200': { description: 'Service health' } } }
    }
  }
};
