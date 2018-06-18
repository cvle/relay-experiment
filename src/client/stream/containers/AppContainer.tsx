import * as React from "react";
import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import {
  withFragmentContainer,
  withLocalStateContainer
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";

import App, { AppProps as InnerProps } from "../components/App";

export interface AppContainerProps {
  data: any;
}

const enhance = compose<InnerProps, AppContainerProps>(
  withLocalStateContainer(
    graphql`
      fragment AppContainerLocal on Local {
        network {
          isOffline
        }
      }
    `
  ),
  withFragmentContainer(
    graphql`
      fragment AppContainer on Query {
        comments {
          id
          ...CommentContainer
        }
      }
    `
  ),
  flattenProp("data")
);

export default enhance(App);
