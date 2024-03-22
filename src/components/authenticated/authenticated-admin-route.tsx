import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../../contexts/current-user-context";

export default function AuthenticatedAdminRoute({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  });

  if (!currentUser?.admin) {
    return <div>Unauthenticated</div>;
  }

  return <>{children}</>;
}
