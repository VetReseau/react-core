import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql',
  }),
  cache,
});

export default client;
