import { css } from '@emotion/css';
import { Button, Input } from 'antd';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import FormContainer from '../components/guest/pages/form-container';
import PageWrapper from '../components/guest/pages/page-wrapper';
import { colors } from '../consts/colors';
import CurrentUserContext from '../contexts/current-user-context';
import StringHelper from '../helpers/string-helper';
import UsersService from '../services/users-service';
import { useNavigate } from "react-router-dom";
import CurrentUserHelper from '../helpers/current-user-helper';

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const {setCurrentUser} = useContext(CurrentUserContext);

  const onChangeEmail = ({ target: { value } }: { target: { value: string } }) => {
    setEmail(value);
  }

  const onChangePassword = ({ target: { value } }: { target: { value: string } }) => {
    setPassword(value);
  }

  const onSubmit = () => {
    setIsLoading(true);

    UsersService
      .signIn({email, password})
      .then(async ({data}) => {
        CurrentUserHelper.set({
          id: data.id,
          authenticationToken: data.authentication_token,
          refreshAuthenticationToken: data.refres_authentication_token,
        });

        const currentUser = await UsersService.me()

        setCurrentUser(currentUser);
        navigate("/dashboard");
      })
      .catch(() => {
        toast.error("There was an error while trying to log in")
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isButtonActive = StringHelper.isPresent(email) && StringHelper.isPresent(password);

  return (
    <PageWrapper>
      <FormContainer onSubmit={onSubmit}>
        <h1 className={styles.heading}>Log in</h1>
        <Input value={email} name="email" type="email" onChange={onChangeEmail} placeholder="email" />
        <Input value={password} name="password" type="password" onChange={onChangePassword} placeholder="password" />
        <Button disabled={!isButtonActive} loading={isLoading} onClick={onSubmit} className={styles.submitButton} type="primary">Log in</Button>
      </FormContainer>
    </PageWrapper>
  );
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
