export const environment = {
  baseUrl:  'http://127.0.0.1:8000/api/v1',
  production: false,
  endPoint: {
    login : 'token/',
    register : 'users/',
    verify: 'token/verify/',
    refresh: 'token/refresh/',
    users: {
      list: 'users/',
      retrieve: 'users/',
      add: 'users/',
      edit: 'users/',
    },
    simulations: {
      list: 'simulations/',
      retrieve: 'simulations/',
      add: 'simulations/',
    },
    subscriptions: {
      list: 'subscriptions/',
      retrieve: 'subscriptions/',
      add: 'subscriptions/',
      status: 'subscriptions/status/',
    },
    categories: {
      list: 'categories/',
      retrieve: 'categories/',
    },
  },
};
