import * as cn from "classnames";
import { pick } from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import { compose } from "recompose";
import { withStyles } from "../hocs";
import BaseButton, { BaseButtonProps } from "./BaseButton";
import * as styles from "./Button.css";

interface ButtonProps extends BaseButtonProps {
  classes?: Partial<typeof styles> & BaseButtonProps["classes"];
  fullWidth?: boolean;
  invert?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

class Button extends React.Component<ButtonProps> {
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

const enhance = compose<ButtonProps, ButtonProps>(withStyles(styles));

export default enhance(Button);
