import { css } from '@emotion/css';
import { Col, Row, Space } from 'antd';
import React from 'react';
import { colors } from '../../../consts/colors';

interface FormContainerParams {
  onSubmit: () => void;
  children: React.ReactElement | React.ReactElement[];
}

export default function FormContainer({onSubmit, children}: FormContainerParams): React.ReactElement {
  return (
    <Row justify="center" className={styles.row}>
      <Col xs={24} sm={24} md={12} lg={12} xl={8}>
        <form onSubmit={onSubmit} className={styles.formRow}>
          <Space direction="vertical" size="middle" className={styles.space}>
            {children}
          </Space>
        </form>
      </Col>
    </Row>
  )
}

const styles = {
  row: css({
    alignItems: 'center',
    flex: 1,
  }),
  space: css({
    display: 'flex',
  }),
  formRow: css(`
    background-color: ${colors.white};
    padding: 48px;
    border-radius: 6px;
    -webkit-box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
    box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
  `),
}
