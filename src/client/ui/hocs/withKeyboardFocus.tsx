import * as React from "react";
import { FocusEvent, HTMLAttributes, MouseEvent } from "react";
import {
  ComponentEnhancer,
  hoistStatics,
  InferableComponentEnhancerWithProps
} from "recompose";

interface WithKeyboardFocusInjectedProps {
  onFocus: React.EventHandler<FocusEvent<any>>;
  onBlur: React.EventHandler<FocusEvent<any>>;
  onMouseDown: React.EventHandler<MouseEvent<any>>;
  keyboardFocus: boolean;
}

/**
 * withKeyboardFocus provides a property `keyboardFocus: boolean`
 * to indicate a focus on the element, that wasn't triggered by mouse
 * or touch.
 */
export default hoistStatics<WithKeyboardFocusInjectedProps>(
  <T extends WithKeyboardFocusInjectedProps>(
    WrappedComponent: React.ComponentType<T>
  ) => {
    class WithKeyboardFocus extends React.Component<any> {
      public state = {
        keyboardFocus: false,
        lastMouseDownTime: 0
      };

      public handleFocus = event => {
        if (this.props.onFocus) {
          this.props.onFocus(event);
        }
        const now = new Date().getTime();
        if (now - this.state.lastMouseDownTime > 750) {
          this.setState({ keyboardFocus: true });
        }
      };

      public handleBlur = event => {
        if (this.props.onBlur) {
          this.props.onBlur(event);
        }
        this.setState({ keyboardFocus: false });
      };

      public handleMouseDown = event => {
        if (this.props.onMouseDown) {
          this.props.onMouseDown(event);
        }
        this.setState({ lastMouseDownTime: new Date().getTime() });
      };

      public render() {
        return (
          <WrappedComponent
            {...this.props}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseDown={this.handleMouseDown}
            keyboardFocus={this.state.keyboardFocus}
          />
        );
      }
    }

    return WithKeyboardFocus as React.ComponentType<any>;
  }
);
