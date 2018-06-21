import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import {
  withFragmentContainer,
  withLocalStateContainer
} from "talk-framework/lib/relay";
import { ReturnPropTypes } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";

import App from "../components/App";

interface InnerProps {
  data: Data;
  local: Local;
}

const AppContainer: StatelessComponent<InnerProps> = props => {
  return <App {...props.data} />;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppContainerLocal on Local {
      network {
        isOffline
      }
    }
  `
)(
  withFragmentContainer<Data>(
    graphql`
      fragment AppContainer on Query {
        comments {
          id
          ...CommentContainer
        }
      }
    `
  )(AppContainer)
);

export type AppContainerProps = ReturnPropTypes<typeof enhanced>;
export default enhanced;
