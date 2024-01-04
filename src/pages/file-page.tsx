import { useContext, useEffect, useState } from "react";
import { Descriptions } from "antd";
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
import CurrentUserContext from "../contexts/current-user-context";
import NotFound from "../components/shared/not-found";

export default function FilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel>(new DriveFileModel());

  const {id} = useParams();
  const {currentUser} = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DriveFilesService
        .find(id)
        .then(setFile)
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

  if (!file.id && !isLoading) {
    return (
      <NotFound />
    )
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper isLoading={isLoading} breadcrumbs={buildBreadcrumbs()} >
        <Descriptions title={file.name} bordered extra={
          <CardExtraActions
            editLinkTo={`/files/${file.id}/edit`}
            manageActionsEnabled={file.userId === currentUser?.id}
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
