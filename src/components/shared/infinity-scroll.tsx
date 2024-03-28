import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useEffect } from "react";

export default function InfinityScroll({
  children,
  disabled,
  isLoading,
  onEndReached,
}: {
  children: React.ReactNode | React.ReactNode[];
  disabled: boolean;
  isLoading: boolean;
  onEndReached: () => void;
}) {
  const onScroll = () => {
    if (disabled) return;

    const scrollTop = document.documentElement.scrollTop;
    const offsetHeight = document.documentElement.offsetHeight;
    const innerHeight = window.innerHeight;

    const endReached = innerHeight + scrollTop >= offsetHeight;

    if (endReached) {
      onEndReached();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <>
      {children}
      <Row gutter={24} justify="center" align="middle">
        <Col span={2}>
          {isLoading && <LoadingOutlined style={{ fontSize: 64 }} />}
        </Col>
      </Row>
    </>
  );
}
