import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import { Comment as CommentData } from "talk-client/__generated__/Comment.graphql";
import createFragmentContainer from "talk-client/helpers/createFragmentContainer";

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
