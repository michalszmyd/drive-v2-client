import { CloseCircleOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import {Checkbox, Col, Image, Input} from "antd";
import {ChangeEvent} from "react";
import DriveFileModelForm from "../../models/forms/drive-file-model-form";

export default function FileUploadInputs({
  fileForm,
  onFileChange,
  onTogglePinned,
  onRemoveFile,
  fieldsShown = true,
}: {
  fileForm: DriveFileModelForm;
  fieldsShown?: boolean;
  onTogglePinned: ({fileForm}: {fileForm: DriveFileModelForm, to: boolean}) => void;
  onRemoveFile: (fileForm: DriveFileModelForm) => void;
  onFileChange: ({
    fileForm,
    event
  }: {
    fileForm: DriveFileModelForm,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  }) => void;
}) {
  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onFileChange({fileForm, event});
  }

  const {pinned, name, body, attachment} = fileForm;

  const attachmentFile = attachment?.file;
  const previewSource = attachmentFile && URL.createObjectURL(attachmentFile);

  return (
    <Col span={fieldsShown ? 24 : 4}>
      {previewSource && (
        <div className={styles.previewContainer}>
          <div onClick={() => onRemoveFile(fileForm)} className={styles.removeButton}>
            <CloseCircleOutlined />
          </div>
          <Image style={{maxHeight: 240}} src={previewSource} />
        </div>
      )}
      {fieldsShown && (
        <Col span={24}>
          <Checkbox
            className={styles.inputField}
            checked={pinned}
            name="pinned"
            onChange={() => onTogglePinned({fileForm, to: !pinned})}
          >
            Pinned
          </Checkbox>
          <Input
            placeholder="Name"
            name="name"
            className={styles.inputField}
            value={name}
            onChange={onChange}
          />
          <Input.TextArea
            rows={4}
            className={styles.inputField}
            placeholder="body"
            name="body"
            value={body}
            onChange={onChange}
            maxLength={6}
          />
        </Col>
      )}
    </Col>
  )
}

const styles = {
  inputField: css({
    margin: '6px 0',
  }),
  previewContainer: css({
    position: 'relative',
    display: 'flex',
    flex: 1,
  }),
  removeButton: css({
    position: 'absolute',
    zIndex: 1,
    color: 'red',
  })
}
