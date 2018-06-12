import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit } from "talk-framework/types";
import { AppContainer as AppContainerData } from "talk-stream/__generated__/AppContainer.graphql";

import App, { AppProps as AppPropsIn } from "../components/App";

interface QueryProps {
  data: AppContainerData;
}

export type AppProps = QueryProps & Omit<AppPropsIn, keyof AppContainerData>;

const enhance = compose<AppPropsIn, AppProps>(
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
