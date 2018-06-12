import * as cn from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";

import * as styles from "./Comment.css";

export interface CommentProps {
  className?: string;
  author: string;
  body: string;
  gutterBottom?: boolean;
}

const Comment: StatelessComponent<CommentProps> = props => {
  const rootClassName = cn(styles.root, props.className, {
    [styles.gutterBottom]: props.gutterBottom
  });
  return (
    <div className={rootClassName}>
      <Typography className={styles.author} gutterBottom>
        {props.author}
      </Typography>
      <Typography>{props.body}</Typography>
    </div>
  );
};

export default Comment;
