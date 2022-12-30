import { css } from "@emotion/css";
import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormContainer from "../components/guest/pages/form-container";
import PageWrapper from "../components/guest/pages/page-wrapper";
import { colors } from "../consts/colors";
import StringHelper from "../helpers/string-helper";
import UsersService from "../services/users-service";

export default function ResetPasswordPage(): React.ReactElement {
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {token} = useParams<string>();

  const onSubmit = () => {
    setIsLoading(true);

    if (!token) {
      return;
    }

    UsersService
      .resetPassword({token, password, passwordConfirmation})
      .then(() => {
        navigate('/sign-in');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const onChangePassword = ({target: {value}}: {target: {value: string}}) => setPassword(value);
  const onChangePasswordConfirmation = ({target: {value}}: {target: {value: string}}) => setPasswordConfirmation(value);
  const isButtonActive = StringHelper.isPresent(password) && StringHelper.isPresent(passwordConfirmation);

  return (
    <PageWrapper>
      <FormContainer onSubmit={onSubmit}>
        <h1 className={styles.heading}>Reset password</h1>
        <Input value={password} name="password" type="password" onChange={onChangePassword} placeholder="New password" />
        <Input value={passwordConfirmation} name="password" type="password" onChange={onChangePasswordConfirmation} placeholder="New password confirmation" />
        <Button disabled={!isButtonActive} loading={isLoading} onClick={onSubmit} className={styles.submitButton} type="primary">Reset password</Button>
      </FormContainer>
    </PageWrapper>
  )
}

const styles = {
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
}
