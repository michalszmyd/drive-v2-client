import { Button, Col, Input, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";

import FolderModel from "../models/folder-model";

import FoldersService from "../services/folders-service";
import NotFound from "../components/shared/not-found";

export default function EditFolderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [folder, setFolder] = useState<FolderModel>(new FolderModel());

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      FoldersService.find(id)
        .then(setFolder)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const onChange = ({
    target: { value, name },
  }: {
    target: { value: string; name: string };
  }) => {
    const newFolder = new FolderModel();

    newFolder.assignAttributes({ ...folder, [name]: value });
    newFolder[name] = value;

    setFolder(newFolder);
  };

  const onPrivateChange = (folderPrivateValue: boolean) => {
    setFolder((state) => {
      if (!state) return state;

      const newFolder = new FolderModel();
      newFolder.assignAttributes({ ...state });
      newFolder.folderPrivate = folderPrivateValue;

      return newFolder;
    });
  };

  const onSave = () => {
    FoldersService.update(folder, {
      folderPrivate: folder.folderPrivate,
      name: folder.name,
    })
      .then(() => {
        toast.success("Folder saved.");

        navigate(`/folders/${folder.id}`);
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

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
            <Switch
              checkedChildren="Private"
              unCheckedChildren="Public"
              checked={folder.folderPrivate}
              onChange={onPrivateChange}
            />
          </Col>
          <Col span={24}>
            <Input value={folder.name} name="name" onChange={onChange} />
          </Col>
          <Col>
            <Button disabled={!folder.isValid} onClick={onSave}>
              Save
            </Button>
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
