import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";

import App, { AppProps as InnerProps } from "../components/App";

export type AppContainerProps = { data: Data } & Omit<InnerProps, keyof Data>;

const enhance = compose<InnerProps, AppContainerProps>(
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
