import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import createFragmentContainer from "talk-framework/helpers/createFragmentContainer";
import { Omit } from "talk-framework/types";
import { Comment as CommentData } from "talk-stream/__generated__/Comment.graphql";

import Comment, { CommentProps as CommentPropsIn } from "../components/Comment";

interface QueryProps {
  data: CommentData;
}

export type CommentProps = QueryProps & Omit<CommentPropsIn, keyof CommentData>;

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
