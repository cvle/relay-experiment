import * as React from "react";
import { graphql } from "react-relay";
import { compose } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";

import App, { AppProps } from "../components/App";
import {
  PostCommentMutation,
  withPostCommentMutation
} from "../mutations/PostCommentMutation";

export interface AppContainerProps {
  data: any;
}

interface InnerProps {
  data: Data;
  postComment: PostCommentMutation;
}

class AppContainer extends React.Component<InnerProps> {
  private handlePostComment = () => {
    this.props.postComment({ body: "What's up?" });
  };

  public render() {
    return <App {...this.props.data} onPostComment={this.handlePostComment} />;
  }
}

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
  withPostCommentMutation
);

export default enhance(AppContainer);
