import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { colors } from "../../consts/colors";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";

export default function Loading({ color }: { color?: string }) {
  const [dots, setDots] = useState<number>(0);

  const animateDots = () => {
    setDots((state) => {
      if (state >= 3) {
        return 0;
      }

      return (state += 1);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      animateDots();
    }, 400);

    return () => {
      clearInterval(interval);
    };
  });

  const dotsText = new Array(dots).fill(".").join("");

  return (
    <div className={styles.container}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <LoadingOutlined style={{ color }} className={styles.loadingIcon} />
        </Col>
        <Col span={24}>
          <span style={{ color }} className={styles.loadingText}>
            Loading{dotsText}
          </span>
        </Col>
      </Row>
    </div>
  );
}

const styles = {
  container: css({
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
  }),
  loadingText: css({
    fontSize: 24,
    color: colors.gray,
  }),
  loadingIcon: css({
    fontSize: 42,
    color: colors.gray,
  }),
};
