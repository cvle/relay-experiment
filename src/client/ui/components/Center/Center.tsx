import * as cn from "classnames";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import { compose } from "recompose";

import { withStyles } from "talk-ui/hocs";

import * as styles from "./Center.css";

export interface CenterProps {
  classes?: Partial<typeof styles>;
  className?: string;
  children: ReactNode;
}

const Center: StatelessComponent<CenterProps> = props => {
  return (
    <div className={cn(props.className, props.classes.root)}>
      {props.children}
    </div>
  );
};

const enhance = compose<CenterProps, CenterProps>(withStyles(styles));

export default enhance(Center);
