import { UploadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Col, Row, Switch } from "antd";
import { ChangeEvent, useState } from "react";
import { colors } from "../../consts/colors";
import StringHelper from "../../helpers/string-helper";
import DriveFileModelForm, { UploadFile } from "../../models/forms/drive-file-model-form";
import FileUploadInputs from "./file-upload-inputs";
import StringValidator from "../../validators/string-validator";

export default function FileForm({
  onSave,
  fileFolderId = null,
  fileId = null,
}: {
  onSave: (files: DriveFileModelForm[]) => Promise<void>;
  fileFolderId?: number | null;
  fileId?: number | null;
}) {
  const [files, setFiles] = useState<DriveFileModelForm[]>([
    new DriveFileModelForm({
      id: fileId,
      folderId: fileFolderId,
    })
  ]);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    onSave(files)
      .then(() => {
        setFiles([
          new DriveFileModelForm({
            id: fileId,
            folderId: fileFolderId,
          }),
        ]);
      }).then(() => {
        setFiles(
          [
            new DriveFileModelForm({
              id: fileId,
              folderId: fileFolderId,
            })
          ]
        );
        setShowPreview(true);
      });
  }

  const onRemoveFile = (fileForm: DriveFileModelForm) => {
    setFiles((state) => {
      if (state.length === 1) {
        const element = state[0];
        element.attachment = null;

        return [element];
      }

      return state.filter((element) => {
        return element.uniqueId !== fileForm.uniqueId;
      })
    });
  }

  const onPushFile = (event: ChangeEvent<HTMLInputElement>) => {
    const {target: {files: uploadedFiles}} = event;

    if (!uploadedFiles) {
      return;
    }

    const filesArray = Array
      .from(uploadedFiles)
      .map((uploadedFile: File) => new UploadFile(({
        file: uploadedFile
      })));

    let [firstStateElement, ...restStateElements] = files;

    if (!firstStateElement.attachment) {
      const firstFile = filesArray[0];

      firstStateElement.attachment = firstFile;
      firstStateElement.name = StringHelper.isBlank(firstStateElement.name) ? firstFile.file.name : firstStateElement.name;
      filesArray.shift();
    }

    const newElements = filesArray.map((uploadedFile: UploadFile) => (
      new DriveFileModelForm({
        name: uploadedFile.file.name,
        attachment: uploadedFile,
      })
    ));

    setFiles([
      firstStateElement,
      ...restStateElements,
      ...newElements,
    ]);
  }

  const onTogglePinned = (
    {
      fileForm,
      to,
    }: {
      fileForm: DriveFileModelForm;
      to: boolean;
    }
  ) => {
    setFiles((state) => {
      return state.map((stateFile) => {
        if (stateFile.uniqueId === fileForm.uniqueId) {
          stateFile.pinned = to;

          return stateFile;
        } else {
          return stateFile;
        }
      })
    })
  }

  const onChange = (
    {
      event,
      fileForm,
    }: {
      fileForm: DriveFileModelForm,
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    }
  ) => {
    const {
      target: {
        value,
        name,
      },
    }: {
      target: {
        value: string;
        name: string;
      }
    } = event;

    // if (!name || !value) {
    //   return;
    // }

    setFiles((state) => {
      return state.map((stateFile) => {
        if (stateFile.uniqueId === fileForm.uniqueId) {
          stateFile[name as NameType] = value;

          return stateFile;
        } else {
          return stateFile;
        }
      })
    })
  }

  const onToggleShowPreview = () => {
    setShowPreview((state) => !state)
  }

  const listFiles = files.length > 1;
  const primaryFile = files[0];
  const isUploadValid = new StringValidator(primaryFile.name).isPresent().isValid;

  return (
    <form className={styles.uploadForm} encType='multipart/form-data' onSubmit={onSubmit}>
      <h1>Upload your files</h1>
      <Row gutter={[0, 12]} justify="space-between">
        <Col span={24}>
          {listFiles && <Switch
            checked={showPreview}
            onChange={onToggleShowPreview}
            checkedChildren="Fields"
            unCheckedChildren="Hidden"
          />}
        </Col>
        <Row gutter={[(showPreview ? 0 : 12), 12]} justify="center">
          {files.map((file) => (
            <FileUploadInputs
              onTogglePinned={onTogglePinned}
              fieldsShown={showPreview}
              key={file.uniqueId}
              fileForm={file}
              onFileChange={onChange}
              onRemoveFile={onRemoveFile}
            />
          ))}
        </Row>
        <Col span={24}>
          <div className={styles.uploader}>
            <label htmlFor="upload_file">
              <UploadButton />
            </label>
            <input
              type="file"
              id="upload_file"
              name="upload_file"
              hidden
              multiple
              onChange={onPushFile}
            />
          </div>
        </Col>
        <Col span={24}>
          <Button disabled={!isUploadValid} type="primary" onClick={onSubmit}>Create</Button>
        </Col>
      </Row>
    </form>
  );
}

function UploadButton() {
  return (
    <div className={styles.uploadButton}>
      <UploadOutlined />
      Upload files
    </div>
  )
}

enum NameType {
  Name = 'name',
  Body = 'body',
}

const styles = {
  uploadForm: css(`
    width: 100%;
    background-color: ${colors.darkWhite};
    padding: 24px;
    border-radius: 12px;
    -webkit-box-shadow: 0px 0px 24px -10px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 0px 24px -10px rgba(66, 68, 90, 1);
    box-shadow: 0px 0px 24px -10px rgba(66, 68, 90, 1);
  `),
  uploader: css({
    display: 'inline-block',
  }),
  uploadButton: css(`
    background-color: ${colors.secondary};
    padding: 12px 24px;
    border-radius: 24px;
    color: ${colors.white};
    font-weight: 600;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition-duration: 0.4s;
    cursor: pointer;
    &:hover {
      -webkit-box-shadow: 0px 0px 28px -15px rgba(66, 68, 90, 1);
      -moz-box-shadow: 0px 0px 28px -15px rgba(66, 68, 90, 1);
      box-shadow: 0px 0px 28px -15px rgba(66, 68, 90, 1);
    }
  `),
  filePreview: {
    borderRadius: 12,
    height: 64,
    width: 64,
  },
}
