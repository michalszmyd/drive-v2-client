import { useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import UserSessionModel from "../models/user-session-model";
import UsersService from "../services/users-service";
import { Collapse } from "antd";
import { toast } from "react-toastify";
import UserSessionsTable from "../components/users/sessions-table";

export default function SettingsPage() {
  const [userSessions, setUserSessions] = useState<UserSessionModel[]>([]);

  useEffect(() => {
    UsersService.userSessions().then(setUserSessions);
  }, []);

  const onDeleteSession = (userSession: UserSessionModel) => {
    UsersService.deleteUserSession(userSession).then(() => {
      setUserSessions((state) =>
        state.filter((element) => element.id !== userSession.id),
      );

      toast.success("Session removed");
    });
  };

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Settings">
        <Collapse>
          <Collapse.Panel header="User sessions" key="user-sessions-1">
            <UserSessionsTable
              userSessions={userSessions}
              onDeleteSession={(record) => onDeleteSession(record)}
            />
          </Collapse.Panel>
        </Collapse>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
