import * as React from "react";
import { StatelessComponent } from "react";

import { graphql, QueryRenderer } from "talk-framework/lib/relay";
import {
  AppQueryResponse,
  AppQueryVariables
} from "talk-stream/__generated__/AppQuery.graphql";

import AppContainer from "../containers/AppContainer";

const AppQuery: StatelessComponent = () => (
  <QueryRenderer<AppQueryVariables, AppQueryResponse>
    query={graphql`
      query AppQuery {
        ...AppContainer
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (error) {
        return <div>{error.message}</div>;
      }
      if (props) {
        return <AppContainer data={props} />;
      }
      return <div>Loading</div>;
    }}
  />
);

export default AppQuery;
