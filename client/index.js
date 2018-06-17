import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import InvoiceSearch from './components/InvoiceSearch';
import InvoiceEdit from './components/InvoiceEdit';
import InvoiceCreate from './components/InvoiceCreate';
import AssetCreate from './components/AssetCreate';
import AssetSearch from './components/AssetSearch';
import requireAuth from './components/requireAuth';
import { DatePicker } from 'antd';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    dataIdFromObject: object => object.id || null
  }),
  defaultOptions: defaultOptions,
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={LoginForm} />
          <Route path="login" component={LoginForm} />
          <Route path="signup" component={SignupForm} />
          <Route path="invoiceCreate" component={requireAuth(InvoiceCreate)} />
          <Route path="invoiceSearch" component={requireAuth(InvoiceSearch)} />
          <Route path="invoiceEdit/:id" component={requireAuth(InvoiceEdit)} />
          <Route path="assetSearch" component={requireAuth(AssetSearch)} />
          <Route path="assetCreate" component={requireAuth(AssetCreate)} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
