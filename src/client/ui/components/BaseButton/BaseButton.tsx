import cn from "classnames";
import React from "react";
import { ButtonHTMLAttributes, StatelessComponent } from "react";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";
import { ReturnPropTypes } from "talk-ui/types";

import * as styles from "./BaseButton.css";

interface InnerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;

  /** If set renders an anchor tag instead */
  anchor?: boolean;

  /** Extend existing styles by adding your custom classnames */
  classes: Partial<typeof styles>;

  keyboardFocus: boolean;
}

/**
 * A button whose styling is stripped off to a minimum and supports
 * keyboard focus. It is the base for the our other buttons.
 */
const BaseButton: StatelessComponent<InnerProps> = ({
  anchor,
  className,
  classes,
  keyboardFocus,
  type: typeProp,
  ...rest
}) => {
  let Element = "button";
  if (anchor) {
    Element = "a";
  }

  let type = typeProp;
  if (anchor && type) {
    // tslint:disable:next-line: no-console
    console.warn(
      "BaseButton used as anchor does not support the `type` property"
    );
  } else if (type === undefined) {
    // Default to button
    type = "button";
  }

  const rootClassName = cn(classes.root, className, {
    [classes.keyboardFocus]: keyboardFocus
  });

  return <Element {...rest} className={rootClassName} />;
};

const enhanced = withStyles(styles)(withKeyboardFocus(BaseButton));
export type BaseButtonProps = ReturnPropTypes<typeof enhanced>;
export default enhanced;
