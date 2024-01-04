import { useEffect, useState } from "react";
import { Button, Checkbox, Col, Descriptions, Input, Popover, Row, Space, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import DriveFilesService from "../services/drive-files-service";
import { ResolvePreview } from "../components/files/resolve-preview";
import { css } from "@emotion/css";
import { colors } from "../consts/colors";
import { CheckOutlined, FolderOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import FoldersService from "../services/folders-service";
import FolderModel from "../models/folder-model";
import ArrayHelper from "../helpers/array-helper";
import RichTextEditor from "../components/shared/rich-text-editor";
import NotFound from "../components/shared/not-found";

export default function EditFilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel>(new DriveFileModel());
  const [moveToFolders, setMoveToFolders] = useState<FolderModel[]>([]);

  const {id} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DriveFilesService
        .find(id)
        .then((file) => {
          setFile(file);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const buildBreadcrumbs = () => {
    if (file.folder) {
      return [
        {
          title: file.folder.name,
          href: `/folders/${file.folder.id}`,
        },
        {
          title: file.name
        }
      ]
    }

    return [file.name];
  }

  const onSave = () => {
    const {body, name, pinned} = file;

    DriveFilesService.update(file, {
      body, name, pinned,
    }).then(() => {
      toast.success('File saved.');

      navigate(`/files/${file.id}`);
    })
    .catch((e) => {
      const {data} = JSON.parse(e.message);

      toast.error(`Error: ${JSON.stringify(data)}`);
    });
  }

  const moveToFolder = async (folderId: number | null) => {
    if (folderId === null) {
      return;
    }

    await DriveFilesService.update(file, {folderId}).then((updatedFile) => {
      toast.success('File moved');

      setFile(updatedFile);
    })
    .catch(({message}) => {
      toast.error(`There was an error while trying to move, ${message}`);

      return null;
    });
  }

  const onFoldersLoad = () => {
    if (ArrayHelper.isAny(moveToFolders)) {
      return;
    }

    FoldersService.me({page: 1, per: 100}).then(({records}) => {
      setMoveToFolders(records);
    })
  }

  const onChange = ({target: {value, name}}: {target: {value: string; name: string;}}) => {
    setFile((state) => {
      const driveFile = new DriveFileModel()
      driveFile.assignAttributes(state);
      driveFile[name] = value;

      return driveFile;
    })
  };

  const onTogglePinned = () => {
    setFile((state) => {
      const driveFile = new DriveFileModel()
      driveFile.assignAttributes(state);
      driveFile.pinned = !state.pinned;

      return driveFile;
    })
  }

  if (!file.id && !isLoading) {
    return (
      <NotFound />
    )
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper isLoading={isLoading} breadcrumbs={buildBreadcrumbs()}>
        <Descriptions bordered title={
          <Input name="name" value={file.name} onChange={onChange} />
        } extra={
          <div className={styles.descriptionExtra}>
            <Space>
              <Popover content={
                <div className={styles.popoverContent}>
                  {moveToFolders.map((folder: FolderModel) => (
                    <p>
                      <Button onClick={() => moveToFolder(folder.id)} type="link">{folder.name}</Button>
                    </p>
                  ))}
                </div>
              } title="Move to folder" trigger="click">
                <Button onClick={onFoldersLoad} shape="circle" icon={<FolderOutlined />} />
              </Popover>
              <Tooltip title="Save">
                <Button icon={<CheckOutlined color={colors.green} />} shape="circle" onClick={onSave} />
              </Tooltip>
            </Space>
          </div>
        }>
          <Descriptions.Item key={file.folderId || 'file-folder'} label="Folder" span={3}>{file.folder?.name}</Descriptions.Item>
          <Descriptions.Item label="Source" span={3}>{file.sourceUrl}</Descriptions.Item>
          <Descriptions.Item label="User">{file.user?.name}</Descriptions.Item>
          <Descriptions.Item label="Vibrant color">{file.vibrantColor}</Descriptions.Item>
          <Descriptions.Item label="Archived">{file.archived ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Private">{file.folder?.folderPrivate ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Created at">{file.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{file.updatedAt}</Descriptions.Item>
        </Descriptions>
        <div className={styles.container}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Checkbox
                className={styles.inputField}
                checked={file.pinned}
                name="pinned"
                onChange={onTogglePinned}
              >
                Pinned
              </Checkbox>
            </Col>
            <Col span={24}>
              <RichTextEditor
                name="body"
                value={file.body || ''}
                onChange={onChange}
              />
            </Col>
            <Col span={24}>
              <ResolvePreview item={file} />
            </Col>
            <Col span={24}>
              <Button onClick={onSave}>Save</Button>
            </Col>
          </Row>
        </div>
      </MainAppWrapper>
    </AuthenticatedRoute>
  )
}

const styles = {
  container: css({
    backgroundColor: colors.gray,
    padding: 24,
    marginTop: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
  }),
  popoverContent: css({
    maxHeight: '400px',
    overflow: 'auto',
  }),
  inputField: css({
    margin: '6px 0',
  }),
  descriptionExtra: css({
    margin: '0 5px',
  }),
}
