import * as cn from "classnames";
import * as React from "react";
import { ComponentType, ReactNode, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";
import { Overwrite } from "talk-ui/types";

import * as styles from "./Center.css";

interface CenterInnerProps {
  classes: Partial<typeof styles>;
  className?: string;
  children: ReactNode;
}

export type CenterProps = Overwrite<
  CenterInnerProps,
  Partial<Pick<CenterInnerProps, "classes">>
>;

const Center: StatelessComponent<CenterInnerProps> = props => {
  return (
    <div className={cn(props.className, props.classes.root)}>
      {props.children}
    </div>
  );
};

export default withStyles(styles)(Center) as ComponentType<CenterProps>;
