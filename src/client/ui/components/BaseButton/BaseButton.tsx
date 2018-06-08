import * as cn from "classnames";
import * as React from "react";
import { ButtonHTMLAttributes, StatelessComponent } from "react";
import { compose } from "recompose";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";

import * as styles from "./BaseButton.css";

export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;

  /** If set renders an anchor tag instead */
  anchor?: boolean;

  /** Extend existing styles by adding your custom classnames */
  classes?: Partial<typeof styles>;

  keyboardFocus?: boolean;
}

/**
 * A button whose styling is stripped off to a minimum and supports
 * keyboard focus. It is the base for the our other buttons.
 */
const BaseButton: StatelessComponent<BaseButtonProps> = ({
  anchor,
  className,
  classes,
  keyboardFocus,
  ...rest
}) => {
  let Element = "button";
  if (anchor) {
    Element = "a";
  }

  const rootClassName = cn(classes.root, className, {
    [classes.keyboardFocus]: keyboardFocus
  });

  return <Element {...rest} className={rootClassName} />;
};

const enhance = compose<BaseButtonProps, BaseButtonProps>(
  withStyles(styles),
  withKeyboardFocus
);

export default enhance(BaseButton);
