import { Col, Collapse, Descriptions, Image, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import FileForm from "../components/files/file-form";
import { ListItem } from "../components/folders/files/list-item";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import FolderModel from "../models/folder-model";
import DriveFileModelForm, {
  UploadingStatus,
} from "../models/forms/drive-file-model-form";
import FoldersService from "../services/folders-service";
import CardExtraActions from "../components/folders/card-extra-actions";
import UploadingFileProgress from "../components/files/uploading-file-progress";
import ArrayHelper from "../helpers/array-helper";
import CurrentUserContext from "../contexts/current-user-context";
import NotFound from "../components/shared/not-found";
import InfinityScroll from "../components/shared/infinity-scroll";
import useFolderFiles from "../hooks/folder-files-hook";

export default function FolderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [folder, setFolder] = useState<FolderModel>(new FolderModel());
  const [uploadingFiles, setUploadingFiles] = useState<DriveFileModelForm[]>(
    [],
  );

  const { id } = useParams();
  const { currentUser } = useContext(CurrentUserContext);

  const {
    onLoadMore,
    deleteFile,
    pushFile,
    isLoading: filesLoading,
    pages: filesPages,
    files,
  } = useFolderFiles({ folderId: id });

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      FoldersService.find(id)
        .then(setFolder)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFilesClick = (
    item: DriveFileModel,
    { target }: React.SyntheticEvent,
  ) => {
    if (target instanceof HTMLElement) {
      const className = target.className;

      if (!className.includes("image")) {
        navigate(`/files/${item.id}`);
      }
    }
  };

  const onFileFormSave = async (files: DriveFileModelForm[]) => {
    if (!id) {
      return;
    }

    for (const file of files) {
      setUploadingFiles((state) => state.concat([file]));

      await FoldersService.createDriveFile(id, file.toFormData())
        .then((driveFile) => {
          toast.success("File uploded.");

          setUploadingFiles((state) => {
            return state.map((element) => {
              if (element.uniqueId === file.uniqueId) {
                element.uploadingStatus = UploadingStatus.SUCCESS;

                return element;
              }

              return element;
            });
          });

          pushFile(driveFile);
        })
        .catch((e) => {
          const { data } = JSON.parse(e.message);

          setUploadingFiles((state) => {
            return state.map((element) => {
              if (element.uniqueId === file.uniqueId) {
                element.uploadingStatus = UploadingStatus.ERROR;

                return element;
              }

              return element;
            });
          });

          toast.error(`Error: ${JSON.stringify(data)}`);
        });
    }
  };

  const onFolderDelete = () => {
    FoldersService.delete(folder)
      .then(() => {
        toast.success(`File '${folder.name}' removed.`);

        navigate(-1);
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const onFolderDownload = () => {};

  if (!folder.id && !isLoading) {
    return <NotFound />;
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper
        isLoading={isLoading}
        breadcrumbs={["Folder", folder.name]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions
              bordered
              title={folder.name}
              size="default"
              extra={
                <CardExtraActions
                  editLinkTo={`/folders/${folder.id}/edit`}
                  manageActionsEnabled={folder.userId === currentUser?.id}
                  downloadOnClick={onFolderDownload}
                  deleteOnClick={onFolderDelete}
                />
              }
            >
              <Descriptions.Item label="User">
                {folder.user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Files">
                {filesPages.total}
              </Descriptions.Item>
              <Descriptions.Item label="Private">
                {folder.folderPrivate}
              </Descriptions.Item>
              <Descriptions.Item label="Created at">
                {folder.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Updated at">
                {folder.updatedAt}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {ArrayHelper.isAny(uploadingFiles) && (
            <Col span={24}>
              <Collapse defaultActiveKey={["uploading-1"]}>
                <Collapse.Panel
                  header="Uploading files progress"
                  key="uploading-1"
                >
                  {uploadingFiles.map((uploadingFile) => (
                    <Col span={24}>
                      <UploadingFileProgress
                        driveFileForm={uploadingFile}
                        key={uploadingFile.uniqueId}
                      />
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
        <InfinityScroll
          isLoading={filesLoading}
          onEndReached={onLoadMore}
          disabled={
            filesLoading || filesPages.currentPage === filesPages.totalPages
          }
        >
          <Row wrap align="middle" style={{ marginTop: 24 }} gutter={[12, 12]}>
            <Image.PreviewGroup>
              {files.map((item) => (
                <Col
                  key={`file-col-${item.id}`}
                  flex={1}
                  xxl={6}
                  xl={8}
                  md={12}
                  sm={24}
                  xs={24}
                  style={{ height: "100%" }}
                >
                  <ListItem
                    onClick={onFilesClick}
                    onDelete={() => deleteFile(item)}
                    item={item}
                  />
                </Col>
              ))}
            </Image.PreviewGroup>
          </Row>
        </InfinityScroll>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
