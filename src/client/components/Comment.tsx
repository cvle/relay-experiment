import * as React from "react";
import { StatelessComponent } from "react";

export interface CommentProps {
  className: string;
  body: string;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return <div>{props.body}</div>;
};

export default Comment;
