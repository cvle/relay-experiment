import * as React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

export interface CommentProps {
  className?: string;
  body: string;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return <Typography>{props.body}</Typography>;
};

export default Comment;
