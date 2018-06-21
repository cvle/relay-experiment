import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { compose, flattenProp } from "recompose";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit, ReturnPropTypes } from "talk-framework/types";
import { CommentContainer as Data } from "talk-stream/__generated__/CommentContainer.graphql";

import Comment, { CommentProps } from "../components/Comment";

type InnerProps = { data: Data } & Omit<CommentProps, keyof Data>;

const CommentContainer: StatelessComponent<InnerProps> = props => {
  const { data, ...rest } = props;
  return <Comment {...rest} {...props.data} />;
};

const enhanced = withFragmentContainer<Data>(
  graphql`
    fragment CommentContainer on Comment {
      author
      body
    }
  `
)(CommentContainer);

export type CommentContainerProps = ReturnPropTypes<typeof enhanced>;
export default enhanced;
