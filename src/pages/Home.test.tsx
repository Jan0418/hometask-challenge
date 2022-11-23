import Home from "./Home";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
// jest.setTimeout(30000);

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

jest.setTimeout(30000);

test("Renders UserDataGrid component", async () => {
  render(
    <ApolloProvider client={createApolloClient()}>
      <Home />
    </ApolloProvider>
  );

  expect(screen.getByRole("progressbar")).toBeInTheDocument();

  fireEvent.change(screen.getByTestId("nameInput"), {
    target: { value: "el" },
  });
  expect(screen.getByDisplayValue("el")).toBeInTheDocument();

  expect(screen.getByRole("progressbar")).toBeInTheDocument();

  await waitFor(
    () => expect(screen.queryByTestId("dataRow")).toBeInTheDocument(),
    {
      timeout: 10000,
    }
  );
});
