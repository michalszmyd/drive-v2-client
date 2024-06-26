import { useEffect, useState } from "react";
import AuthenticatedAdminRoute from "../../components/authenticated/authenticated-admin-route";
import AdminUsersService from "../../services/admin-users-service";
import UserModel from "../../models/user-model";
import { Button, Divider, Popover, Space } from "antd";
import MainAppWrapper from "../../components/main-app-wrapper";
import Column from "antd/es/table/Column";
import { CreditCardOutlined, LockOutlined } from "@ant-design/icons";
import { colors } from "../../consts/colors";
import { toast } from "react-toastify";
import UserResetPasswordModel from "../../models/user-reset-password-model";
import ArrayHelper from "../../helpers/array-helper";
import TableItemsList from "../../components/files/table-list";
import UserSessionsTable from "../../components/users/sessions-table";
import UserSessionModel from "../../models/user-session-model";

type ResetPassword = {
  user: UserModel;
  resetPassword: UserResetPasswordModel;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [resetPasswordUsers, setResetPasswordUsers] = useState<ResetPassword[]>(
    [],
  );

  useEffect(() => {
    AdminUsersService.all().then(({ records }) => {
      setUsers(records);
    });
  }, []);

  const userToTableItem = (user: UserModel) => {
    const { id, name, email, createdAt, updatedAt, admin, sessions } = user;

    return {
      key: id,
      id,
      name,
      email,
      createdAt,
      updatedAt,
      admin,
      sessions,
    };
  };

  const tableItems = users.map(userToTableItem);

  const onResetPassword = (user: UserModel) => {
    if (!user.id) {
      return;
    }

    AdminUsersService.resetPassword(user.id)
      .then((resetPassword) => {
        toast.success("Reset password success");

        const resetPasswordUser = {
          user,
          resetPassword,
        };

        setResetPasswordUsers((state) => state.concat(resetPasswordUser));
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const onDeleteSession = (userSession: UserSessionModel) => {
    AdminUsersService.deleteSession(userSession.userId, userSession.id)
      .then(() => {
        setUsers((state) => {
          return state.map((user: UserModel) => {
            if (user.id === userSession.userId) {
              user.sessions = user.sessions.filter(
                (session) => session.id !== userSession.id,
              );
            }

            return user;
          });
        });

        toast.success("Session removed");
      })
      .catch(() => {
        toast.error("Session cannot be removed");
      });
  };

  const expandedRowRender = (record: UserModel) => {
    return (
      <UserSessionsTable
        onDeleteSession={onDeleteSession}
        userSessions={record.sessions}
      />
    );
  };

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="Users" breadcrumbs={["All users"]}>
        <ResetPasswordTable resetPasswordUsers={resetPasswordUsers} />
        <TableItemsList
          expandable={{
            expandedRowRender: (r: UserModel) => expandedRowRender(r),
          }}
          dataSource={tableItems}
        >
          <Column key="user-id" title="ID" dataIndex="id" />
          <Column key="user-name" title="Name" dataIndex="name" />
          <Column key="user-email" title="Email" dataIndex="email" />
          <Column
            key="user-createdAt"
            title="Created At"
            dataIndex="createdAt"
          />
          <Column
            key="user-updatedAt"
            title="Updated At"
            dataIndex="updatedAt"
          />
          <Column key="user-admin" title="Admin?" dataIndex="admin" />
          <Column
            title="Action"
            key="action"
            render={(_: string, record: UserModel) => (
              <Space size="middle">
                <Popover title="Reset password">
                  <Button
                    onClick={() => onResetPassword(record)}
                    type="primary"
                    shape="circle"
                    icon={<CreditCardOutlined />}
                  />
                </Popover>
                <Popover title="Suspend account">
                  <Button
                    disabled
                    danger
                    shape="circle"
                    icon={<LockOutlined style={{ color: colors.redDelete }} />}
                  />
                </Popover>
              </Space>
            )}
          />
        </TableItemsList>
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
  );
}

function ResetPasswordTable({
  resetPasswordUsers,
}: {
  resetPasswordUsers: ResetPassword[];
}) {
  if (ArrayHelper.isEmpty(resetPasswordUsers)) {
    return null;
  }

  return (
    <>
      <Divider orientation="left">ResetPassword</Divider>
      <TableItemsList dataSource={resetPasswordUsers}>
        <Column
          key="user-reset-id"
          title="ID"
          dataIndex="user.id"
          render={(_, record: ResetPassword) => record.user.id}
        />
        <Column
          key="user-reset-name"
          title="Name"
          dataIndex="user.name"
          render={(_, record: ResetPassword) => record.user.name}
        />
        <Column
          key="user-reset-email"
          title="Email"
          dataIndex="user.email"
          render={(_, record: ResetPassword) => record.user.email}
        />
        <Column
          key="user-reset-token"
          title="Token"
          dataIndex="resetPassword.resetPasswordToken"
          render={(_, record: ResetPassword) =>
            record.resetPassword.resetPasswordToken
          }
        />
        <Column
          key="user-reset-token"
          title="Token sent at"
          dataIndex="resetPassword.resetPasswordSentAt"
          render={(_, record: ResetPassword) =>
            record.resetPassword.resetPasswordSentAt
          }
        />
        <Column
          key="user-reset-token"
          title="One time token"
          dataIndex="resetPassword.oneTimeToken"
          render={(_, record: ResetPassword) =>
            record.resetPassword.oneTimeToken
          }
        />
      </TableItemsList>
      <Divider />
    </>
  );
}
