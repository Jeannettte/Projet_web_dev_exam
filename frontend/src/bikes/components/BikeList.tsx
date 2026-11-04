import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import type { CreateBikeModel } from "../models/BikeModel";
import { useBikesProvider } from "../providers/useBikesPrvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

const PAGE_SIZE_OPTIONS = [10, 20, 50]; // never above 50 (API limit)

interface BikesListProps {
  page: number;
  limit: number;
  // Changes the URL (?page=..&limit=..), provided by the route
  onPaginationChange: (page: number, limit: number) => void;
}

// Paginated catalogue (same logic as CustomersList)
export const BikesList = ({
  page,
  limit,
  onPaginationChange,
}: BikesListProps) => {
  const { bikes, totalCount, isLoading, load, deleteBike, createBike } =
    useBikesProvider();

  // Reload every time the page or the page size changes
  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  // The requested page is past the end (the last bike of the last page was
  // deleted, or the URL was edited by hand): go back to the last page.
  useEffect(() => {
    if (!isLoading && bikes.length === 0 && totalCount > 0 && page > 1) {
      onPaginationChange(Math.ceil(totalCount / limit), limit);
    }
  }, [isLoading, bikes, totalCount, page, limit]);

  // Reload the current page after a deletion. The promise is returned so
  // DeleteBikeButton can display the 409 error if the bike was sold.
  const onDelete = (id: string) =>
    deleteBike(id).then(() => load(page, limit));

  // Same for the creation: the new bike may appear on the current page
  const onCreate = (input: CreateBikeModel) =>
    createBike(input).then(() => load(page, limit));

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={onCreate} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={onDelete} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={limit}
        total={totalCount} // totalCount comes from the API response
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showSizeChanger
        showTotal={(total) => `${total} bikes`}
        onChange={onPaginationChange}
      />
    </Space>
  );
};