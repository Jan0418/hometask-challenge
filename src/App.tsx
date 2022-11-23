import Home from "./pages/Home";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const token = "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";

const createApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        "Apollo-Require-Preflight": "true",
        authorization: `Bearer ${token}`,
      },
    }),
  });
};
const client = createApolloClient();

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Home />
      </div>
    </ApolloProvider>
  );
}

export default App;
