import * as React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

export interface LogoProps {
  className?: string;
  gutterBottom?: boolean;
}

const Logo: StatelessComponent<LogoProps> = props => {
  return (
    <Typography variant="heading1" gutterBottom={props.gutterBottom}>
      Talk NEO
    </Typography>
  );
};

export default Logo;
