import { css } from '@emotion/css';
import { Button, Col, Input, Row, Space } from 'antd';
import { useState } from 'react';
import PageWrapper from '../components/guest/pages/page-wrapper';
import { colors } from '../consts/colors';
import StringHelper from '../helpers/string-helper';

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeEmail = ({ target: { value } }: { target: { value: string } }) => {
    setEmail(value);
  }

  const onChangePassword = ({ target: { value } }: { target: { value: string } }) => {
    setPassword(value);
  }

  const onSubmit = () => {
    setIsLoading(true);
  }

  const isButtonActive = StringHelper.isPresent(email) && StringHelper.isPresent(password);

  return (
    <PageWrapper>
      <Row justify="center" style={{alignItems: 'center', flex: 1}}>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <form className={styles.loginRow}>
            <Space direction="vertical" size="middle" className={styles.space}>
              <h1 className={styles.heading}>Log in</h1>
              <Input value={email} name="email" type="email" onChange={onChangeEmail} placeholder="email" />
              <Input value={password} name="password" type="password" onChange={onChangePassword} placeholder="password" />
              <Button disabled={!isButtonActive} loading={isLoading} onClick={onSubmit} className={styles.submitButton} type="primary">Log in</Button>
            </Space>
          </form>
        </Col>
      </Row>
    </PageWrapper>
  );
}

const styles = {
  space: css({
    display: 'flex',
  }),
  heading: css({
    fontWeight: 300,
  }),
  submitButton: css(`
    margin-top: 12px;
    background-color: ${colors.main};

    :hover {
      background-color: ${colors.secondary} !important;
    }
  `),
  loginRow: css(`
    background-color: ${colors.white};
    padding: 48px;
    border-radius: 6px;
    -webkit-box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
    box-shadow: 0px 0px 38px -11px rgba(66, 68, 90, 1);
  `),
}
