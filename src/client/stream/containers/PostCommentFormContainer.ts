import * as React from "react";
import { graphql } from "react-relay";
import { compose, mapProps } from "recompose";

import PostCommentForm, {
  PostCommentFormProps as InnerProps
} from "../components/PostCommentForm";
import { withPostCommentMutation, withSetNetworkStatusMutation } from "../mutations";

const enhance = compose<InnerProps, {}>(
  withPostCommentMutation,
  withSetNetworkStatusMutation,
  mapProps(({ postComment, setNetworkStatus }) => ({
    onSubmit: (input, form) => {
      postComment(input);
      setNetworkStatus({isOffline: true});
      form.reset();
    }
  }))
);

export default enhance(PostCommentForm);
