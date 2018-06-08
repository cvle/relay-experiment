import * as React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

export interface LogoProps {
  className?: string;
}

const Logo: StatelessComponent<LogoProps> = props => {
  return <Typography variant="heading3">Talk NEO</Typography>;
};

export default Logo;
