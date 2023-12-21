import { useEffect, useState } from "react";
import { Button, Col, Descriptions, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import DriveFilesService from "../services/drive-files-service";
import { ResolvePreview } from "../components/files/resolve-preview";
import { css } from "@emotion/css";
import { colors } from "../consts/colors";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { CheckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function EditFilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel | null>(null);
  const [editableBody, setEditableBody] = useState<string>('');

  const {id} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DriveFilesService
        .find(id)
        .then((file) => {
          setFile(file);
          setEditableBody(file.body || '');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <span>Loading...</span>
    )
  }

  if (!file) {
    return (
      <span>Not found</span>
    )
  }

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
    DriveFilesService.update(file, {
      body: editableBody,
    }).then(() => {
      toast.success('File saved.');

      navigate(`/files/${file.id}`);
    })
    .catch((e) => {
      const {data} = JSON.parse(e.message);

      toast.error(`Error: ${JSON.stringify(data)}`);
    });
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={buildBreadcrumbs()}>
        <Descriptions bordered title={file.name} extra={
          <Button icon={<CheckOutlined color={colors.green} />} shape="round" onClick={onSave} />
        }>
          <Descriptions.Item label="Folder" span={3}>{file.folder?.name}</Descriptions.Item>
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
              <ReactQuill theme="snow" value={editableBody} onChange={setEditableBody} />
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
  })
}
