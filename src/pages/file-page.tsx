import { useEffect, useState } from "react";
import { Badge, Descriptions, Image } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFileModel from "../models/drive-file-model";
import DriveFilesService from "../services/drive-files-service";
import { ResolvePreview } from "../components/files/resolve-preview";
import { css } from "@emotion/css";
import { colors } from "../consts/colors";
import CardExtraActions from "../components/folders/card-extra-actions";
import { toast } from "react-toastify";

export default function FilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel | null>(null);

  const {id} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DriveFilesService
        .find(id)
        .then(setFile)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

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

  const onFileDelete = () => {
    DriveFilesService
      .destroy(file)
      .then(() => {
        toast.success(`File '${file.name}' removed.`);

        if (file.folderId) {
          navigate(`/folders/${file.folderId}`);
        } else {
          navigate('/dashboard');
        }
      })
      .catch((e) => {
        const {data} = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper isLoading={isLoading} breadcrumbs={buildBreadcrumbs()} >
        <Descriptions title={file.name} bordered extra={
          <CardExtraActions
            editLinkTo={`/files/${file.id}/edit`}
            deleteOnClick={onFileDelete}
          />
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
          <p dangerouslySetInnerHTML={{__html: file.body || ''}} />
          <ResolvePreview item={file} />
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
