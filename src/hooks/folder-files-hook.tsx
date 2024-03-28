import { useEffect, useState } from "react";
import DriveFileModel from "../models/drive-file-model";
import { ResponsePages } from "../services/api-service";
import DriveFilesService from "../services/drive-files-service";
import { toast } from "react-toastify";

const PER_PAGE = 16;

export default function useFolderFiles({
  folderId,
}: {
  folderId: number | undefined | string;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<DriveFileModel[]>([]);
  const [pages, setPages] = useState<ResponsePages>({
    currentPage: 1,
    totalPages: 1,
    per: PER_PAGE,
    total: 1,
  });

  const fetchFiles = ({
    page = 1,
    per = PER_PAGE,
  }: {
    page?: number;
    per?: number;
  } = {}) => {
    if (!folderId) return;

    DriveFilesService.folderFiles(folderId, { page, per })
      .then(({ records, pages }) => {
        setPages((pagesState) => {
          if (pages.currentPage === 1) {
            setFiles(records);
          } else if (pagesState.currentPage !== pages.currentPage) {
            setFiles((state) => state.concat(records));
          }

          return pages;
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setErrors(["Errors while fetching files"]);
      });
  };

  const onLoadMore = () => {
    if (isLoading) return;

    setIsLoading(true);

    const { currentPage, per } = pages;

    fetchFiles({ page: currentPage + 1, per });
  };

  const deleteFile = (removedDriveFile: DriveFileModel) => {
    DriveFilesService.destroy(removedDriveFile)
      .then(() => {
        toast.success(`File '${removedDriveFile.name}' removed.`);

        setFiles((state) =>
          state.filter((driveFile) => driveFile.id !== removedDriveFile.id),
        );
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const pushFile = (driveFile: DriveFileModel) => {
    setFiles((state) => [driveFile].concat(state));
  };

  useEffect(() => {
    fetchFiles();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onLoadMore,
    deleteFile,
    pushFile,
    pages,
    errors,
    isLoading,
    files,
  };
}
