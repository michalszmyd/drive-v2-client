import ActivityModel from "../../models/activity-model";

export const activityToTableItem = (activity: ActivityModel) => {
  const {
    id,
    resource,
    resourceId,
    applicationId,
    action,
    metadata,
    requestInfo,
    createdAt,
    updatedAt,
    user,
    user: { name: userName = "", id: userId = "" } = {},
  } = activity;

  return {
    key: id,
    id,
    user,
    userName,
    userId,
    resource,
    resourceId,
    applicationId,
    action,
    metadata,
    requestInfo,
    createdAt,
    updatedAt,
  };
};