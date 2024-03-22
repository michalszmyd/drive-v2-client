import { useContext, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import CurrentUserContext from "../contexts/current-user-context";
import { Button, Col, Input, Row } from "antd";
import UserModel from "../models/user-model";
import UsersService from "../services/users-service";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [user, setUser] = useState<UserModel>(currentUser || new UserModel());

  const onChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => {
    const updatedUser = new UserModel();
    updatedUser.assignAttributes(user);
    updatedUser[name] = value;

    setUser(updatedUser);
  };

  const onSave = async () => {
    UsersService.updateCurrentUser(user)
      .then((updatedUser) => {
        toast.success("User updated.");

        setUser(updatedUser);
        setCurrentUser(updatedUser);
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper
        title={`My Profile ${currentUser.displayName}`}
        breadcrumbs={["My Profile"]}
      >
        <form>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                placeholder="Email"
                disabled
                name="email"
                value={user.email}
              />
            </Col>
            <Col span={24}>
              <Input
                placeholder="Name"
                name="name"
                value={user.name}
                onChange={onChange}
              />
            </Col>
            <Col span={24}>
              <Button type="primary" onClick={onSave}>
                Save
              </Button>
            </Col>
          </Row>
        </form>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
