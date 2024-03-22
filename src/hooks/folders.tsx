import { Dispatch, SetStateAction, useState } from "react";
import FoldersService from "../services/folders-service";
import FolderModel from "../models/folder-model";
import { toast } from "react-toastify";

export default function useFolders(
  props?: any,
): [
  FolderModel[],
  Dispatch<SetStateAction<FolderModel[]>>,
  (item: FolderModel) => void,
] {
  const [folders, setFolders] = useState<FolderModel[]>(props || []);

  function toggleFavorites(item: FolderModel) {
    if (!item.id) return;

    FoldersService.toggleFavorites(item.id)
      .then(() => {
        setFolders((state: FolderModel[]) => {
          return state.map((folder) => {
            if (folder.id === item.id) {
              folder.favorite = !folder.favorite;
            }

            return folder;
          });
        });

        const info = item.favorite ? "added to" : "removed from";

        toast.success(`${item.name} ${info} the favorites`);
      })
      .catch(() => {
        toast.error("There was an error processing your request");
      });
  }

  return [folders, setFolders, toggleFavorites];
}
