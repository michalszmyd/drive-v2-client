import { Tag } from "antd";
import { ActivityActionType } from "../../models/activity-model";

export default function ActionTag({ action }: { action: ActivityActionType }) {
  return <Tag color={actionTagColor(action)}>{action.toUpperCase()}</Tag>;
}

function actionTagColor(action: ActivityActionType) {
  switch (action) {
    case ActivityActionType.Visit:
      return "blue";
    case ActivityActionType.Create:
      return "green";
    case ActivityActionType.Update:
      return "yellow";
    case ActivityActionType.Delete:
      return "red";
    case ActivityActionType.Restore:
      return "purple";
    default:
      return "black";
  }
}
