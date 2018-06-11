import * as cn from "classnames";
import { capitalize } from "lodash";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import { compose } from "recompose";

import { withStyles } from "talk-ui/hocs";

import * as styles from "./Typography.css";

// Based on Typography Component of Material UI.
// https://github.com/mui-org/material-ui/blob/303199d39b42a321d28347d8440d69166f872f27/packages/material-ui/src/Typography/Typography.js

export interface TypographyProps {
  /**
   * Set the text-align on the component.
   */
  align?: "inherit" | "left" | "center" | "right" | "justify";
  /**
   * The content of the component.
   */
  children: ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<typeof styles>;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?:
    | "inherit"
    | "primary"
    | "textSecondary"
    | "secondary"
    | "error"
    | "default";
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   * By default, it maps the variant to a good default headline component.
   */
  component?: React.ComponentType<any>;
  /**
   * If `true`, the text will have a bottom margin.
   */
  gutterBottom?: boolean;
  /**
   * We are empirically mapping the variant property to a range of different DOM element types.
   * For instance, h1 to h6. If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` property.
   */
  headlineMapping?: object;
  /**
   * If `true`, the text will not wrap, but instead will truncate with an ellipsis.
   */
  noWrap?: boolean;
  /**
   * If `true`, the text will have a bottom margin.
   */
  paragraph?: boolean;
  /**
   * Applies the theme typography styles.
   */
  variant?:
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button";
}

const Typography: StatelessComponent<TypographyProps> = props => {
  const {
    align,
    classes,
    className,
    color,
    component,
    gutterBottom,
    headlineMapping,
    noWrap,
    paragraph,
    variant,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    classes[variant],
    {
      [classes[`color${capitalize(color)}`]]: color !== "default",
      [classes.noWrap]: noWrap,
      [classes.gutterBottom]: gutterBottom,
      [classes.paragraph]: paragraph,
      [classes[`align${capitalize(align)}`]]: align !== "inherit"
    },
    className
  );

  const Component =
    component || (paragraph ? "p" : headlineMapping[variant]) || "span";

  return <Component className={rootClassName} {...rest} />;
};

Typography.defaultProps = {
  align: "inherit",
  color: "default",
  gutterBottom: false,
  headlineMapping: {
    heading1: "h1",
    heading2: "h1",
    heading3: "h1",
    heading4: "h1",
    subtitle1: "h2",
    subtitle2: "h3",
    body1: "p",
    body2: "aside"
  },
  noWrap: false,
  paragraph: false,
  variant: "body1"
};

const enhance = compose<TypographyProps, TypographyProps>(withStyles(styles));

export default enhance(Typography);
