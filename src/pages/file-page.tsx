import { useContext, useEffect, useState } from "react";
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
import FileDescriptions from "../components/files/file-descriptions";
import FileMetadataText from "../components/files/file-metadata-text";

export default function FilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel>(new DriveFileModel());

  const { id } = useParams();
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DriveFilesService.find(id)
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
          title: file.name,
        },
      ];
    }

    return [file.name];
  };

  const onFileDelete = () => {
    DriveFilesService.destroy(file)
      .then(() => {
        toast.success(`File '${file.name}' removed.`);

        if (file.folderId) {
          navigate(`/folders/${file.folderId}`);
        } else {
          navigate("/dashboard");
        }
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  if (!file.id && !isLoading) {
    return <NotFound />;
  }

  return (
    <AuthenticatedRoute>
      <MainAppWrapper isLoading={isLoading} breadcrumbs={buildBreadcrumbs()}>
        <FileDescriptions
          file={file}
          descriptionsParams={{
            title: file.name,
            bordered: true,
            extra: (
              <CardExtraActions
                sourceUrl={file.sourceUrl}
                editLinkTo={`/files/${file.id}/edit`}
                manageActionsEnabled={file.userId === currentUser?.id}
                deleteOnClick={onFileDelete}
              />
            ),
          }}
        />
        <FileMetadataText text={file.imageMetadataText} />
        <div className={styles.container}>
          <p dangerouslySetInnerHTML={{ __html: file.body || "" }} />
          <ResolvePreview item={file} />
        </div>
        <div className={styles.divider} />
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

const styles = {
  container: css({
    backgroundColor: colors.gray,
    padding: 24,
    marginTop: 16,
    textAlign: "justify",
    textJustify: "inter-word",
  }),
  divider: css({
    margin: '12px 0',
  })
};
