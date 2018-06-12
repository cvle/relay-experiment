import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";
import { PostCommentMutationVariables } from "talk-stream/__generated__/PostCommentMutation.graphql";

export type PostCommentInput = Omit<
  PostCommentMutationVariables["input"],
  "clientMutationId"
>;
export type PostCommentMutation = (input: PostCommentInput) => void;

const mutation = graphql`
  mutation PostCommentMutation($input: PostCommentInput!) {
    postComment(input: $input) {
      comment {
        id
        author
        body
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment, input: PostCommentInput) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId++
      }
    },
    updater: store => {
      const payload = store.getRootField("postComment");
      const newRecord = payload.getLinkedRecord("comment");
      const root = store.get("client:root");
      const records = root.getLinkedRecords("comments");
      root.setLinkedRecords([...records, newRecord], "comments");
    }
  });
}

export const withPostCommentMutation = createMutationContainer(
  "postComment",
  commit
);
