import { useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import { ResponsePages } from "../services/api-service";
import FoldersService from "../services/folders-service";
import useFolders from "../hooks/folders";
import { Folders } from "../components/folders/folders";

export default function FoldersPage() {
  const [folders, setFolders, toggleFavorites] = useFolders();
  const [pages, setPages] = useState<ResponsePages>({
    currentPage: 1,
    totalPages: 1,
    per: 40,
    total: 1,
  });

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFolders = () => {
    const { currentPage, per } = pages;

    FoldersService.all({ page: currentPage, per }).then(
      ({ pages, records }) => {
        setPages(pages);
        setFolders(records);
      },
    );
  };

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={["Folders"]} title="Folders">
        <Folders folders={folders} onFavoriteClick={toggleFavorites} />
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
