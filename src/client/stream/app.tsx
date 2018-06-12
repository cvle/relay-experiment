import * as React from "react";
import { StatelessComponent } from "react";
import * as ReactDOM from "react-dom";
import { graphql, QueryRenderer } from "react-relay";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { Button, Center } from "talk-ui/components";

import Logo from "./components/Logo";
import Comment from "./containers/Comment";
import PostCommentMutation from "./mutations/PostCommentMutation";

function fetchQuery(operation, variables) {
  return fetch(
    `${window.location.protocol}//${window.location.hostname}:3000/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: operation.text,
        variables
      })
    }
  ).then(response => {
    return response.json();
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});

const postComment = () => {
  PostCommentMutation.commit(modernEnvironment, "testBody");
};

const App: StatelessComponent = () => (
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query appQuery {
        comment {
          id
          ...Comment
        }
        comments {
          id
          ...Comment
        }
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (error) {
        return <div>{error.message}</div>;
      }
      if (props) {
        return (
          <Center>
            <Logo gutterBottom />
            {props.comments.map(comment => (
              <Comment key={comment.id} data={comment} gutterBottom />
            ))}
            <Button onClick={postComment} primary>
              Post
            </Button>
          </Center>
        );
      }
      return <div>Loading</div>;
    }}
  />
);

ReactDOM.render(<App />, document.getElementById("app"));
