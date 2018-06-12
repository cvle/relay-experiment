import * as cn from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";

import { Button, Center } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import Logo from "./Logo";

export interface AppProps {
  comments: [{ id: string }];
}

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
