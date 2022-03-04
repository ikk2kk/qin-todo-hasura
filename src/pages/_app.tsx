import "src/styles/global.css";

import { ApolloProvider } from "@apollo/client";
import { client } from "lib/apolloClient";
import type { AppProps } from "next/app";

const App = (props: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <props.Component {...props.pageProps} />
    </ApolloProvider>
  );
};

export default App;
