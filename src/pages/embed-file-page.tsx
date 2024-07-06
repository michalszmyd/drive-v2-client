import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DriveFileModel from "../models/drive-file-model";
import { ResolvePreview } from "../components/files/resolve-preview";
import { css } from "@emotion/css";
import { colors } from "../consts/colors";
import NotFound from "../components/shared/not-found";
import FileMetadataText from "../components/files/file-metadata-text";
import { Helmet } from "react-helmet";
import SETTINGS from "../consts/settings";
import EmbedDriveFilesService from "../services/embed-drive-files-service";
import { Button, Layout } from "antd";

export default function EmbedFilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<DriveFileModel>(new DriveFileModel());

  const [params] = useSearchParams();

  const id = params.get("id");
  const signature = params.get("signature");
  const date = params.get("date");
  const expires = params.get("expires");
  const algorithm = params.get("algorithm");

  useEffect(() => {
    if (id && signature && date && expires && algorithm) {
      EmbedDriveFilesService.find({
        id,
        signature,
        date,
        expires,
        algorithm,
      })
        .then(setFile)
        .finally(() => setIsLoading(false));
    }
  }, [algorithm, date, expires, id, signature]);

  if (!file.id && !isLoading) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Helmet>
        <meta title="test" />
        <title>Drive </title>
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={SETTINGS.HOST_URL + "/files/embed/" + file.id}
        />
        {file.isVideo && (
          <Helmet>
            <meta property="og:video" content={file.sourceUrl || ""} />
            <meta property="og:video:width" content="640" />
            <meta property="og:video:height" content="426" />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:type" content="text/html" />
            <meta property="og:title" content={file.name} />
          </Helmet>
        )}
        {file.isImage && (
          <Helmet>
            <meta property="og:image" content={file.sourceUrl || ""} />
            <meta property="og:description" content="description text" />
          </Helmet>
        )}
        <meta property="og:site_name" content={SETTINGS.HOST_URL} />
      </Helmet>
      <div className={styles.divider} />
      <Button>Go to file</Button>
      <FileMetadataText text={file.imageMetadataText} />
      <div className={styles.container}>
        <p dangerouslySetInnerHTML={{ __html: file.body || "" }} />
        <ResolvePreview item={file} />
      </div>
    </Layout>
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
    margin: "12px 0",
  }),
};
