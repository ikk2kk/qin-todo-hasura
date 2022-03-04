import { createHttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { wsLink } from "lib/WebSocketLink";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/v1/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation !== "subscription";
  },
  httpLink,
  wsLink
);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      query_root: {
        queryType: true,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mutation_root: {
        mutationType: true,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      subscription_root: {
        subscriptionType: true,
      },
      // Users: {
      //   keyFields: ["login"]
      // }
    },
  }),
  connectToDevTools: true,
});
