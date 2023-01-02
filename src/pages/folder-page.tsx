import { Descriptions, List } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import { ListItem } from "../components/folders/files/list-item";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import FolderModel from "../models/folder-model";
import { ResponsePages } from "../services/api-service";
import DriveFilesService from "../services/drive-files-service";
import FoldersService from "../services/folders-service";

export default function FolderPage() {
  const [folder, setFolder] = useState<FolderModel | null>(null);
  const [files, setFiles] = useState<DriveFileModel[]>([]);
  const [pages, setPages] = useState<ResponsePages>({currentPage: 1, totalPages: 1, per: 20});

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      FoldersService.find(id).then(setFolder);
      fetchDriveFiles();
    }
  }, [id]);

  const fetchDriveFiles = () => {
    const {currentPage, per} = pages;

    if (id) {
      DriveFilesService.folderFiles(id, {page: currentPage, per}).then(({records, pages}) => {
        setFiles(records)
        setPages(pages);
      });
    }
  }

  const onFilesClick = (item : DriveFileModel, {target: {className}}: {target: {className: string}}) => {
    if (!className.includes('image')) {
      navigate(`/files/${item.id}`);
    }
  }

  if (!folder) {
    return (
      <div>Not found</div>
    )
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={['Folder', folder.name]}>
        <Descriptions
          bordered
          title={folder.name}
          size={"default"}
        >
          <Descriptions.Item label="Created at">{folder.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{folder.updatedAt}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{folder.updatedAt}</Descriptions.Item>
        </Descriptions>
        <List
          style={{marginTop: 15}}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          dataSource={files}
          rowKey='id'
          renderItem={(item) => (
            <ListItem onClick={onFilesClick} item={item} />
          )}
        />
      </MainAppWrapper>
    </AuthenticatedRoute>
  )
}

