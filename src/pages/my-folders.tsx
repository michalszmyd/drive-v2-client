import { useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import { ResponsePages } from "../services/api-service";
import FoldersService from "../services/folders-service";
import useFolders from "../hooks/folders-hook";
import { Folders } from "../components/folders/folders";
import InfinityScroll from "../components/shared/infinity-scroll";

export default function MyFolders() {
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders, toggleFavorites] = useFolders([]);
  const [pages, setPages] = useState<ResponsePages>({
    currentPage: 1,
    totalPages: 1,
    per: 40,
    total: 1,
  });

  useEffect(() => {
    fetchFolders({ page: 1, per: 40 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFolders = ({ page, per }: { page: number; per: number }) => {
    FoldersService.me({ page, per })
      .then(({ pages, records }) => {
        setPages((pagesState) => {
          if (pages.currentPage === 1) {
            setFolders(records);
          } else if (pagesState.currentPage !== pages.currentPage) {
            setFolders((state) => state.concat(records));
          }

          return pages;
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onNextPage = () => {
    if (isLoading) return;

    setIsLoading(true);

    const { currentPage, per } = pages;

    fetchFolders({ page: currentPage + 1, per });
  };

  const { currentPage, totalPages } = pages;

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={["My Folders"]} title="My Folders">
        <InfinityScroll
          onEndReached={onNextPage}
          isLoading={isLoading}
          disabled={isLoading || currentPage === totalPages}
        >
          <Folders folders={folders} onFavoriteClick={toggleFavorites} />
        </InfinityScroll>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
