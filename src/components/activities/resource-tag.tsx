import { Tag } from "antd";
import { ActivityResourceType } from "../../models/activity-model";
import { Link } from "react-router-dom";

export default function ResourceTag({
  resource,
  resourceId,
}: {
  resource: ActivityResourceType;
  resourceId?: number | null;
}) {
  if (
    resource === ActivityResourceType.Folder ||
    resource === ActivityResourceType.Folders
  ) {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/folders/${resourceId}`}>
          {resource.toString().toUpperCase()}
        </Link>
      </Tag>
    );
  }

  if (
    resource === ActivityResourceType.File ||
    resource === ActivityResourceType.FileShare
  ) {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/files/${resourceId}`}>
          {resource.toString().toUpperCase()}
        </Link>
      </Tag>
    );
  }

  return (
    <Tag color={resourceTagColor(resource)}>
      {resource.toString().toUpperCase()}
    </Tag>
  );
}

function resourceTagColor(resource: ActivityResourceType) {
  switch (resource) {
    case ActivityResourceType.Folder:
    case ActivityResourceType.Folders:
      return "volcano";
    case ActivityResourceType.File:
      return "cyan";
    case ActivityResourceType.Session:
      return "geekblue";
    case ActivityResourceType.User:
      return "magenta";
    case ActivityResourceType.FileShare:
      return "purple";
    default:
      return "black";
  }
}
