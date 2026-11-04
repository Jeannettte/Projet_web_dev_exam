import axios from "axios";
import { useRef, useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
} from "../models/BikeModel";

const BIKES_URL = "http://localhost:3000/bikes";

// Data and API calls for the paginated list of bikes
// (same structure as useCustomersProvider)
export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Only the latest request may update the state (avoids out-of-order responses
  // when the user changes page quickly)
  const lastRequestId = useRef(0);

  // Loads one page of the catalogue
  const load = (page: number, limit: number) => {
    const requestId = ++lastRequestId.current;
    setIsLoading(true);
    return axios
      .get<BikesPageModel>(BIKES_URL, { params: { page, limit } })
      .then((result) => {
        // A more recent request has been sent: ignore this outdated response
        if (requestId !== lastRequestId.current) return;
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        if (requestId === lastRequestId.current) setIsLoading(false);
      });
  };

  // The promise is returned so the caller can react to errors
  // (e.g. 409 when the bike has already been sold).
  // Deleting/creating shifts the content of every page: the caller reloads.
  const deleteBike = (id: string) =>
    axios.delete(`${BIKES_URL}/${id}`).then(() => undefined);

  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>(BIKES_URL, input).then(() => undefined);

  return { bikes, totalCount, isLoading, load, deleteBike, createBike };
};