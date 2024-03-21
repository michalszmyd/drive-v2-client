import { useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import { ResponsePages } from "../services/api-service";
import FoldersService from "../services/folders-service";
import useFolders from "../hooks/folders";
import { Folders } from "../components/folders/folders";

export default function MyFolders() {
  const [folders, setFolders, toggleFavorites] = useFolders([]);
  const [pages, setPages] = useState<ResponsePages>({currentPage: 1, totalPages: 1, per: 40, total: 1});

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = () => {
    const {currentPage, per} = pages;

    FoldersService.me({page: currentPage, per}).then(({
      pages,
      records,
    }) => {
      setPages(pages);
      setFolders(records);
    });
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={['My Folders']} title="My Folders">
        <Folders folders={folders} onFavoriteClick={toggleFavorites} />
      </MainAppWrapper>
    </AuthenticatedRoute>
  )
}

