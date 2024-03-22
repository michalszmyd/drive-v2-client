import { css } from "@emotion/css";
import { Checkbox, Col, Input } from "antd";
import { ChangeEvent } from "react";
import DriveFileModelForm from "../../models/forms/drive-file-model-form";
import FilePreview from "./file-preview";
import RichTextEditor, {
  RichEditorChangeEvent,
} from "../shared/rich-text-editor";

export default function FileUploadInputs({
  fileForm,
  onFileChange,
  onTogglePinned,
  onRemoveFile,
  fieldsShown = true,
}: {
  fileForm: DriveFileModelForm;
  fieldsShown?: boolean;
  onTogglePinned: ({
    fileForm,
  }: {
    fileForm: DriveFileModelForm;
    to: boolean;
  }) => void;
  onRemoveFile: (fileForm: DriveFileModelForm) => void;
  onFileChange: ({
    fileForm,
    event,
  }: {
    fileForm: DriveFileModelForm;
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | RichEditorChangeEvent;
  }) => void;
}) {
  const onChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | RichEditorChangeEvent,
  ) => {
    onFileChange({ fileForm, event });
  };

  const { pinned, name, body, attachment } = fileForm;

  const attachmentFile = attachment?.file;
  const previewSource = attachmentFile && URL.createObjectURL(attachmentFile);

  return (
    <Col span={fieldsShown ? 24 : 3}>
      {previewSource && (
        <FilePreview
          onRemove={onRemoveFile}
          fileForm={fileForm}
          previewSource={previewSource}
          fileType={attachmentFile.type}
        />
      )}
      {fieldsShown && (
        <>
          <Checkbox
            className={styles.inputField}
            checked={pinned}
            name="pinned"
            onChange={() => onTogglePinned({ fileForm, to: !pinned })}
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
          <RichTextEditor value={body} name="body" onChange={onChange} />
        </>
      )}
    </Col>
  );
}

const styles = {
  inputField: css({
    margin: "6px 0",
  }),
  previewContainer: css({
    position: "relative",
    display: "flex",
    flex: 1,
  }),
  removeButton: css({
    position: "absolute",
    zIndex: 1,
    color: "red",
  }),
};
