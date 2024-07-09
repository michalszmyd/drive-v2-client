import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DriveFileModel from "../models/drive-file-model";
import { ResolvePreview } from "../components/files/resolve-preview";
import { css } from "@emotion/css";
import NotFound from "../components/shared/not-found";
import FileMetadataText from "../components/files/file-metadata-text";
import EmbedDriveFilesService from "../services/embed-drive-files-service";
import { Button, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";

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
    <Layout style={{ display: "flex", flex: 1, minHeight: "100vh" }}>
      <Content>
        <Row className={styles.row}>
          <Col className={styles.wrapper} span={24}>
            <FileMetadataText text={file.imageMetadataText} />
            <div className={styles.container}>
              <p dangerouslySetInnerHTML={{ __html: file.body || "" }} />
              <ResolvePreview item={file} />
            </div>
          </Col>
          <Col className={styles.wrapper} span={24}>
            <Button size="large" type="primary">
              <Link to={`/files/${file.id}`}>Go to file</Link>
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

const styles = {
  container: css({
    padding: 24,
    marginTop: 16,
    textAlign: "justify",
    textJustify: "inter-word",
  }),
  divider: css({
    margin: "12px 0",
  }),
  row: css({
    flexDirection: "column",
  }),
  wrapper: css({
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    display: "flex",
    alignItems: "center",
    width: "100%",
  }),
};
