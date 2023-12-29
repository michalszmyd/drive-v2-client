import AuthenticatedAdminRoute from "../components/authenticated/authenticated-admin-route";
import MainAppWrapper from "../components/main-app-wrapper";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import SETTINGS from "../consts/settings";
import { useEffect, useState } from "react";
import ApplicationsService from "../services/applications-service";
import Loading from "../components/shared/loading";

export default function ApplicationsApiDocsPage() {
  const url = `${SETTINGS.API_URL}/api/v1/applications/docs`;

  const [schema, setSchema] = useState<object>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ApplicationsService.docs().then((data) => {
      setSchema(data);
      setIsLoading(false);
    });
  }, [])

  console.log({schema});

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="API Docs" breadcrumbs={['Applications', 'API Docs']}>
        {
          isLoading ? (
            <Loading />
          ) : (
            <SwaggerUI spec={schema} />
          )
        }
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
  )
}
