import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apikey = process.env.EXPO_PUBLIC_GRAPHQL_API_KEY;

const link = new HttpLink({
  uri: 'https://oohaale.us-east-a.ibm.stepzen.net/api/flexi-coach/__graphql',
  headers: {
    Authorization: 'apikey ' + apikey,
  },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
