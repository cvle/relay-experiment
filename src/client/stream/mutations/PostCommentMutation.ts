import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";

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

function commit(environment, body) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        body,
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

export default { commit };
