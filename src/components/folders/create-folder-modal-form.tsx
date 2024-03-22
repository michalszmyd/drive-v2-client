import { Button, Checkbox, Col, Input, Modal, Row, Space } from "antd";
import { useState } from "react";
import FolderModel from "../../models/folder-model";
import FolderModelForm from "../../models/forms/folder-model-form";
import FoldersService from "../../services/folders-service";
import { toast } from "react-toastify";

export default function CreateFolderModalForm({
  onCreate,
  opened,
  onCloseModal,
}: {
  opened: boolean;
  onCreate: (folder: FolderModel) => void;
  onCloseModal: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [folder, setFolder] = useState<FolderModelForm>(new FolderModelForm());

  const onSubmitForm = () => {
    if (folder.isValid()) {
      setIsLoading(true);

      FoldersService.create(folder.toParams())
        .then((folder) => {
          toast.success("Folder created");
          setFolder(new FolderModelForm());
          onCreate(folder);
        })
        .catch(({ message }) => {
          toast.error(`There was an error while trying to create, ${message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onToggleFolderPrivate = () => {
    setFolder(
      (state) =>
        new FolderModelForm({
          ...state,
          folderPrivate: !state.folderPrivate,
        }),
    );
  };

  const onChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => {
    setFolder(
      new FolderModelForm({
        ...folder,
        [name]: value,
      }),
    );
  };

  const { folderPrivate, name } = folder;

  return (
    <Modal
      open={opened}
      title="Create new folder"
      onCancel={onCloseModal}
      footer={[
        <Button key="back" onClick={onCloseModal}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={onSubmitForm}
        >
          Create
        </Button>,
      ]}
    >
      <form onSubmit={onSubmitForm}>
        <Row>
          <Space>
            <Col>
              <Input
                placeholder="Folder name"
                name="name"
                value={name}
                onChange={onChange}
              />
            </Col>
            <Col>
              <Checkbox
                checked={folderPrivate}
                onChange={onToggleFolderPrivate}
              >
                Folder private
              </Checkbox>
            </Col>
          </Space>
        </Row>
      </form>
    </Modal>
  );
}
