import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit } from "talk-framework/types";
import { AppContainer as AppContainerData } from "talk-stream/__generated__/AppContainer.graphql";

import App, { AppProps as AppInnerProps } from "../components/App";

interface DataProps {
  data: AppContainerData;
}

export type AppProps = DataProps & Omit<AppInnerProps, keyof AppContainerData>;

const enhance = compose<AppInnerProps, AppProps>(
  withFragmentContainer(
    graphql`
      fragment AppContainer on Query {
        comments {
          id
          ...Comment
        }
      }
    `
  ),
  flattenProp("data")
);

export default enhance(App);
