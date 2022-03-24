import "src/styles/global.css";

import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { client } from "lib/apolloClient";
import type { AppProps } from "next/app";

const App = (props: AppProps) => {
  return (
    <MantineProvider>
      <NotificationsProvider>
        <ApolloProvider client={client}>
          <props.Component {...props.pageProps} />
        </ApolloProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;
