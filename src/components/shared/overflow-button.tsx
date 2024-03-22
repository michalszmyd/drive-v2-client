import { css } from "@emotion/css";
import { Button } from "antd";
import React from "react";

export default function OverflowButton({
  children,
  onClick,
  icon,
}: {
  children?: React.ReactElement | React.ReactElement[] | undefined;
  onClick:
    | (React.MouseEventHandler<HTMLAnchorElement> &
        React.MouseEventHandler<HTMLButtonElement>)
    | undefined;
  icon: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Button
        icon={icon}
        shape="circle"
        className={styles.button}
        onClick={onClick}
        size="large"
        type="primary"
      >
        {children}
      </Button>
    </div>
  );
}

const styles = {
  container: css({
    left: 15,
    bottom: 15,
    position: "fixed",
  }),
  button: css({
    // width: '100px !important',
    // height: '100px !important',
    // fontSize: '28px !important',
  }),
};
