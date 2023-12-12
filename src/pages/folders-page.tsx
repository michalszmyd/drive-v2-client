import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import FoldersList from "../components/folders/folders-list";
import MainAppWrapper from "../components/main-app-wrapper";
import FolderModel from "../models/folder-model";
import { ResponsePages } from "../services/api-service";
import FoldersService from "../services/folders-service";

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderModel[]>([]);
  const [pages, setPages] = useState<ResponsePages>({currentPage: 1, totalPages: 1, per: 40, total: 1});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = () => {
    const {currentPage, per} = pages;

    FoldersService.all({page: currentPage, per}).then(({
      pages,
      records,
    }) => {
      setPages(pages);
      setFolders(records);
    });
  }

  const onItemClick = (item: FolderModel) => {
    navigate(`/folders/${item.id}`);
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={['Folders']}>
        <FoldersList folders={folders} onItemClick={onItemClick} />
      </MainAppWrapper>
    </AuthenticatedRoute>
  )
}

