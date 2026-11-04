import axios from "axios";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

const BIKES_URL = "http://localhost:3000/bikes";

// Data and API calls for the detail page of one bike
export const useBikeDetailsProvider = (bikeId: string) => {
  const [bike, setBike] = useState<BikeModel | null>(null);
  // Starts at true so the page shows a skeleton instead of "not found" at first render
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const load = () => {
    setIsLoading(true);
    return (
      axios
        .get<BikeModel>(`${BIKES_URL}/${bikeId}`)
        .then((result) => setBike(result.data))
        // 404 or network error: bike stays null and the page shows "Bike not found"
        .catch(() => setBike(null))
        .finally(() => setIsLoading(false))
    );
  };

  // Not caught here: on failure the promise rejects, so the form stays open.
  // On success the state is replaced by the bike returned by the API.
  const updateBike = (input: UpdateBikeModel) =>
    axios
      .patch<BikeModel>(`${BIKES_URL}/${bikeId}`, input)
      .then((result) => setBike(result.data));

  // Rejects with a 409 if the bike is linked to a sale
  const deleteBike = (id: string) =>
    axios.delete(`${BIKES_URL}/${id}`).then(() => undefined);

  return { bike, isLoading, load, updateBike, deleteBike };
};