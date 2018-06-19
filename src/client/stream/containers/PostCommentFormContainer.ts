import * as React from "react";
import { graphql } from "react-relay";
import { compose, mapProps } from "recompose";

import { BadUserInputError } from "talk-framework/lib/errors";

import PostCommentForm, {
  PostCommentFormProps as InnerProps
} from "../components/PostCommentForm";
import { withPostCommentMutation } from "../mutations";

const enhance = compose<InnerProps, {}>(
  withPostCommentMutation,
  mapProps(({ postComment, setNetworkStatus }) => ({
    onSubmit: async (input, form) => {
      try {
        await postComment(input);
        form.reset();
      } catch (error) {
        if (error instanceof BadUserInputError) {
          return error.invalidArgsLocalized;
        }
      }
    }
  }))
);

export default enhance(PostCommentForm);
