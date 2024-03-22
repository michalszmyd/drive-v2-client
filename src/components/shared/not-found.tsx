import AuthenticatedRoute from "../authenticated/authenticated-route";
import MainAppWrapper from "../main-app-wrapper";

export default function NotFound() {
  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Nie ma czego plądrować 🤷🏼‍♂️">
        <div>Page not found</div>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
