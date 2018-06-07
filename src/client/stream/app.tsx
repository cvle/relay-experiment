import * as React from "react";
import { StatelessComponent } from "react";
import * as ReactDOM from "react-dom";
import { graphql, QueryRenderer } from "react-relay";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

import Button from "talk-ui/components/Button";

import Comment from "./containers/Comment";

function fetchQuery(operation, variables) {
  return fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => {
    return response.json();
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});

const App: StatelessComponent = () => (
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query appQuery {
        comment {
          ...Comment
        }
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (props) {
        return (
          <div>
            <Comment data={props.comment} />
            <Button primary>Post</Button>
          </div>
        );
      } else {
        return <div>Loading</div>;
      }
    }}
  />
);

ReactDOM.render(<App />, document.getElementById("app"));
