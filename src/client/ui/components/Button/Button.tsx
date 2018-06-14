import cn from "classnames";
import { pick } from "lodash";
import * as React from "react";
import { ComponentType, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";
import { Overwrite } from "talk-ui/types";

import BaseButton, { BaseButtonProps } from "../BaseButton";
import * as styles from "./Button.css";

interface InnerProps extends BaseButtonProps {
  classes: Partial<typeof styles> & BaseButtonProps["classes"];
  fullWidth?: boolean;
  invert?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

export type ButtonProps = Overwrite<
  InnerProps,
  Partial<Pick<InnerProps, "classes">>
>;

class Button extends React.Component<InnerProps> {
  public render() {
    const {
      classes,
      className,
      fullWidth,
      invert,
      primary,
      secondary,
      ...rest
    } = this.props;

    const rootClassName = cn(classes.root, className, {
      [classes.invert]: invert,
      [classes.fullWidth]: fullWidth,
      [classes.primary]: primary,
      [classes.secondary]: secondary
    });

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus")}
        {...rest}
      />
    );
  }
}

export default withStyles(styles)(Button) as ComponentType<ButtonProps>;
