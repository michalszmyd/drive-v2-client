import AuthenticatedAdminRoute from "../components/authenticated/authenticated-admin-route";
import MainAppWrapper from "../components/main-app-wrapper";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import SETTINGS from "../consts/settings";

export default function ApplicationsApiDocsPage() {
  const url = `${SETTINGS.API_URL}/api/v1/applications/docs`;

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="API Docs" breadcrumbs={['Applications', 'API Docs']}>
        <SwaggerUI url={url} />
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
  )
}
