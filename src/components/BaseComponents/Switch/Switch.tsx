import React, { useEffect, useState } from "react";

import { SwitchButton, SwitchDot } from "./styled";

interface SwitchProps {
  defaultChecked?: boolean;
  controlChecked?: boolean;
  onChange: (value: boolean) => void;
  size?: string;
}

const Switch = function ({
  defaultChecked,
  controlChecked,
  onChange,
  size = "default",
}: SwitchProps) {
  const [checked, setChecked] = useState(defaultChecked || controlChecked);

  let checkedLeft;
  if (size === "default") {
    checkedLeft = "calc(100% - 20px);";
  } else if (size === "small") {
    checkedLeft = "calc(100% - 14px);";
  }

  useEffect(() => {
    if (controlChecked !== undefined) {
      setChecked(controlChecked);
    }
  }, [controlChecked]);

  return (
    <SwitchButton
      size={size}
      checked={checked}
      type='button'
      role='switch'
      aria-checked='true'
      ant-click-animating='false'
      onClick={() => {
        setChecked(!checked);
        onChange(!checked);
      }}
    >
      <SwitchDot
        size={size}
        checked={checked}
        checkedLeft={checkedLeft}
      ></SwitchDot>
      {/* <span
        css={css`
          display: block;
          margin: 0 7px 0 25px;
          color: #fff;
          font-size: 12px;
          transition: margin 0.2s;
        `}
      ></span> */}
    </SwitchButton>
  );
};
export default Switch;
