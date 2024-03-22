import { Badge, Descriptions, DescriptionsProps } from "antd";
import DriveFileModel from "../../models/drive-file-model";
import StringHelper from "../../helpers/string-helper";

function resolveHostingBadgeColor(hosting: string | null): string {
  if (!hosting) {
    return "gray";
  }

  const hash = {
    amazon_s3: "cyan",
    discord: "purple",
    local: "lime",
  };

  return hash[hosting as keyof typeof hash] || "yellow";
}

export default function FileDescriptions({
  file,
  descriptionsParams,
}: {
  descriptionsParams: DescriptionsProps;
  file: DriveFileModel;
}) {
  return (
    <Descriptions {...descriptionsParams}>
      <Descriptions.Item
        key={file.folderId || "file-folder"}
        label="Folder"
        span={3}
      >
        {file.folder?.name}
      </Descriptions.Item>
      <Descriptions.Item label="Hosting">
        <Badge
          color={resolveHostingBadgeColor(file.hostingSource)}
          text={file.hostingSource && StringHelper.humanize(file.hostingSource)}
        />
      </Descriptions.Item>
      <Descriptions.Item label="User">{file.user?.name}</Descriptions.Item>
      <Descriptions.Item label="Vibrant color">
        {file.vibrantColor}
      </Descriptions.Item>
      <Descriptions.Item label="Private">
        {file.folder?.folderPrivate ? "Yes" : "No"}
      </Descriptions.Item>
      <Descriptions.Item label="Created at">{file.createdAt}</Descriptions.Item>
      <Descriptions.Item label="Updated at">{file.updatedAt}</Descriptions.Item>
    </Descriptions>
  );
}
