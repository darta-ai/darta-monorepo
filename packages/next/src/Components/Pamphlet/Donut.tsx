import * as Colors from '@darta-styles'
import React from "react";
import { animated,SpringValue  } from "react-spring";

function Donut({ percent }: { percent: SpringValue<number> | number }) {
    const [value, setValue] = React.useState<SpringValue<number> | number>(percent);
    
    React.useEffect(() => {
        console.log(percent)
        setValue(percent)
    }, [percent])

  return (
    <svg
      viewBox="0 0 51 51"
      strokeWidth="2.5"
      fill={Colors.PRIMARY_400}
      stroke={Colors.PRIMARY_50}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="150"
      strokeDashoffset={value as number}
      style={{
        width: '40px',
        height: '40px'
    }}
    >
      <circle
        transform="translate(25.500000, 25.500000) rotate(-270.000000) translate(-25.500000, -25.500000)"
        cx="25.5"
        cy="25.5"
        r="24.5"
       />
    </svg>
  );
}


export const AnimatedDonut = animated(Donut);