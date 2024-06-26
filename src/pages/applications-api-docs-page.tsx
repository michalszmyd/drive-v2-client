import MainAppWrapper from "../components/main-app-wrapper";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import ApplicationsService from "../services/applications-service";
import Loading from "../components/shared/loading";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";

export default function ApplicationsApiDocsPage() {
  const [schema, setSchema] = useState<object>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ApplicationsService.docs().then((data) => {
      setSchema(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper
        title="API Docs"
        breadcrumbs={["Applications", "API Docs"]}
      >
        {isLoading ? <Loading /> : <SwaggerUI spec={schema} />}
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
