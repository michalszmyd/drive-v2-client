import { Divider, Progress, ProgressProps } from "antd";
import DriveFileModelForm, { UploadingStatus } from "../../models/forms/drive-file-model-form";
import { colors } from "../../consts/colors";
import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import Text from "../shared/text";

const twoColors = {
  '0%': colors.main,
  '100%': colors.secondary,
}

export default function UploadingFileProgress({driveFileForm}: {driveFileForm: DriveFileModelForm}) {
  const [progressPerecentage, setProgressPercentage] = useState<number>(0);
  const [status, setStatus] = useState<ProgressProps['status']>('normal');

  const updateProgressPercentage = (progressPerecentageValue: number) => {
    if (progressPerecentageValue >= 99 || driveFileForm.uploadingStatus === UploadingStatus.ERROR) return;

    setProgressPercentage((state) => state + 1);

    setTimeout(() => updateProgressPercentage(progressPerecentageValue + 1), 100 * (progressPerecentageValue / 20));
  }

  useEffect(() => {
    updateProgressPercentage(progressPerecentage);

    switch(driveFileForm.uploadingStatus) {
      case UploadingStatus.SUCCESS:
        setProgressPercentage(100);
        return setStatus('success');
      case UploadingStatus.ERROR:
        return setStatus('exception');
    }
  }, [driveFileForm.uploadingStatus]);

  return (
    <>
      <Text className={styles[driveFileForm.uploadingStatus]}>{driveFileForm.name}</Text>
      <Progress status={status} percent={progressPerecentage} strokeColor={twoColors} />
    </>
  )
}

const styles = {
  success: css({
    color: colors.green,
  }),
  error: css({
    color: colors.redDelete,
  }),
  waiting: css({
    colors: colors.gray,
  }),
  uploading: css({
  })
}
