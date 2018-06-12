import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit } from "talk-framework/types";
import { CommentContainer as Data } from "talk-stream/__generated__/CommentContainer.graphql";

import Comment, { CommentProps as InnerProps } from "../components/Comment";

export type CommentContainerProps = { data: Data } & Omit<
  InnerProps,
  keyof Data
>;

const enhance = compose<InnerProps, CommentContainerProps>(
  withFragmentContainer(
    graphql`
      fragment CommentContainer on Comment {
        author
        body
      }
    `
  ),
  flattenProp("data")
);

export default enhance(Comment);
