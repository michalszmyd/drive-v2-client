import { Button, Col, Collapse, Descriptions, Divider, List, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import FileForm from "../components/files/file-form";
import { ListItem } from "../components/folders/files/list-item";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import FolderModel from "../models/folder-model";
import DriveFileModelForm, { UploadingStatus } from "../models/forms/drive-file-model-form";
import { ResponsePages } from "../services/api-service";
import DriveFilesService from "../services/drive-files-service";
import FoldersService from "../services/folders-service";
import { colors } from "../consts/colors";
import { css } from "@emotion/css";
import CardExtraActions from "../components/folders/card-extra-actions";
import UploadingFileProgress from "../components/files/uploading-file-progress";
import ArrayHelper from "../helpers/array-helper";

export default function FolderPage() {
  const [folder, setFolder] = useState<FolderModel | null>(null);
  const [files, setFiles] = useState<DriveFileModel[]>([]);
  const [pages, setPages] = useState<ResponsePages>({currentPage: 1, totalPages: 1, per: 20, total: 1});
  const [uploadingFiles, setUploadingFiles] = useState<DriveFileModelForm[]>([]);

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      FoldersService.find(id).then(setFolder);
      fetchDriveFiles()?.then(({records, pages}) => {
        setFiles(records);
        setPages(pages);
      });
    }
  }, [id]);

  const fetchDriveFiles = ({page = 1, per = 20}: {page: number; per: number;} = {page: 1, per: 20}) => {
    if (id) {
      return DriveFilesService.folderFiles(id, {page, per}).then(({records, pages}) => {
        return {records, pages}
      });
    }
  }

  const onFilesClick = (item : DriveFileModel, {target: {className}}: {target: {className: string}}) => {
    if (!className.includes('image')) {
      navigate(`/files/${item.id}`);
    }
  }

  const onFileFormSave = async (files: DriveFileModelForm[]) => {
    if (!id) {
      return;
    }

    for (const file of files) {
      setUploadingFiles((state) => state.concat([file]));

      await FoldersService.createDriveFile(id, file.toFormData()).then((driveFile) => {
        toast.success('File uploded.');

        setUploadingFiles((state) => {
          return state.map((element) => {
            if (element.uniqueId === file.uniqueId) {
              element.uploadingStatus = UploadingStatus.SUCCESS;

              return element
            }

            return element;
          });
        });

        setFiles((state) => [driveFile].concat(state));
      }).catch((e) => {
        const {data} = JSON.parse(e.message);

        setUploadingFiles((state) => {
          return state.map((element) => {
            if (element.uniqueId === file.uniqueId) {
              element.uploadingStatus = UploadingStatus.ERROR;

              return element
            }

            return element;
          });
        });

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
    }
  }

  if (!folder) {
    return (
      <div>Not found</div>
    )
  }

  const onLoadMore = () => {
    const {currentPage, per} = pages;

    return fetchDriveFiles({page: currentPage + 1, per})?.then(({records, pages}) => {
      setFiles((state) => state.concat(records));
      setPages(pages);
    });
  }

  const onFileDelete = (item: DriveFileModel) => {
    DriveFilesService
      .destroy(item)
      .then(() => {
        toast.success(`File '${item.name}' removed.`);

        setFiles((state) => (
          state.filter((folderItem) => (folderItem.id !== item.id))
        ));
      })
      .catch((e) => {
        const {data} = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={['Folder', folder.name]}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions
              bordered
              title={folder.name}
              size="default"
              extra={
                <CardExtraActions
                  editLinkTo={`/folders/${folder.id}/edit`}
                  deleteOnClick={() => {}}
                />
              }
            >
              <Descriptions.Item label="User">{folder.user.name}</Descriptions.Item>
              <Descriptions.Item label="Files">{pages.total}</Descriptions.Item>
              <Descriptions.Item label="Private">{folder.folderPrivate}</Descriptions.Item>
              <Descriptions.Item label="Created at">{folder.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Updated at">{folder.updatedAt}</Descriptions.Item>
            </Descriptions>
          </Col>
          {ArrayHelper.isAny(uploadingFiles) && (
            <Col span={24} >
            <Collapse defaultActiveKey={['uploading-1']}>
              <Collapse.Panel header="Uploading files progress" key="uploading-1">
                {uploadingFiles.map((uploadingFile) => (
                  <Col span={24}>
                    <UploadingFileProgress driveFileForm={uploadingFile} key={uploadingFile.uniqueId} />
                  </Col>
                ))}
              </Collapse.Panel>
            </Collapse>
            </Col>
          )}
          <Col span={24}>
            <FileForm onSave={onFileFormSave} />
          </Col>
        </Row>
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
            <ListItem
              onClick={onFilesClick}
              onDelete={() => onFileDelete(item)}
              item={item}
            />
          )}
          loadMore={
            <Button onClick={onLoadMore}>Load more</Button>
          }
        />
      </MainAppWrapper>
    </AuthenticatedRoute>
  )
}
