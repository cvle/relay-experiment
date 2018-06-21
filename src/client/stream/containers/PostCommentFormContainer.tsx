import React, { Component } from "react";
import { graphql } from "react-relay";
import { compose, mapProps } from "recompose";

import { BadUserInputError } from "talk-framework/lib/errors";
import { OnSubmit } from "talk-framework/lib/form";
import { ReturnPropTypes } from "talk-framework/types";

import PostCommentForm, {
  PostCommentFormProps
} from "../components/PostCommentForm";
import { PostCommentMutation, withPostCommentMutation } from "../mutations";

interface InnerProps {
  postComment: PostCommentMutation;
}

class PostCommentFormContainer extends Component<InnerProps> {
  private onSubmit: PostCommentFormProps["onSubmit"] = async (input, form) => {
    try {
      await this.props.postComment(input);
      form.reset();
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
    }
  };
  public render() {
    return <PostCommentForm onSubmit={this.onSubmit} />;
  }
}

const enhanced = withPostCommentMutation(PostCommentFormContainer);
export type PostCommentFormContainerProps = ReturnPropTypes<typeof enhanced>;
export default enhanced;
