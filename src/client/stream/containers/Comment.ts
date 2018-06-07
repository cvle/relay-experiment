import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import createFragmentContainer from "talk-framework/helpers/createFragmentContainer";
import { Comment as CommentData } from "talk-stream/__generated__/Comment.graphql";

import Comment, { CommentProps as CommentPropsIn } from "../components/Comment";

export interface CommentProps {
  data: CommentData;
}

const enhance = compose<CommentPropsIn, CommentProps>(
  createFragmentContainer(
    graphql`
      fragment Comment on Comment {
        body
      }
    `
  ),
  flattenProp("data")
);

export default enhance(Comment);
