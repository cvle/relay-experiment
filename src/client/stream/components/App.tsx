import * as cn from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";

import { AppContainer as AppProps } from "talk-stream/__generated__/AppContainer.graphql";
import { Button, Center } from "talk-ui/components";
export {
  AppContainer as AppProps
} from "talk-stream/__generated__/AppContainer.graphql";

import CommentContainer from "../containers/CommentContainer";
import Logo from "./Logo";

const postComment = () => {};

const App: StatelessComponent<AppProps> = props => {
  return (
    <Center>
      <Logo gutterBottom />
      {props.comments.map(comment => (
        <CommentContainer key={comment.id} data={comment as any} gutterBottom />
      ))}
      <Button onClick={postComment} primary>
        Post
      </Button>
    </Center>
  );
};

export default App;
