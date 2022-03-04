// for Apollo Client v3:
import type { FetchResult, Operation } from "@apollo/client/core";
import { ApolloLink, Observable } from "@apollo/client/core";
import type { GraphQLError } from "graphql";
import { print } from "graphql";
import type { Client } from "graphql-ws";
import { createClient } from "graphql-ws";

class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (err instanceof Error) {
              return sink.error(err);
            }

            if (err instanceof CloseEvent) {
              return sink.error(new Error(`Socket closed with event ${err.code} ${err.reason || ""}`));
            }

            return sink.error(
              new Error(
                (err as GraphQLError[])
                  .map(({ message }) => {
                    return message;
                  })
                  .join(", ")
              )
            );
          },
        }
      );
    });
  }
}

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: "ws://localhost:8080/v1/graphql",
        lazy: true,
        connectionParams: async () => {
          return {
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "Sec-WebSocket-Protocol": "graphql-ws",
            },
          };
        },
      })
    : undefined;

export const wsLink = typeof window !== "undefined" && wsClient ? new WebSocketLink(wsClient) : undefined;
