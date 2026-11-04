import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";
import { BikeFormModal } from "./BikeFormModal";

interface EditBikeButtonProps {
  bike: BikeModel;
  updateBike: (input: UpdateBikeModel) => Promise<unknown>;
}

// "Edit" button + modification modal: it reuses the creation form,
// pre-filled with the current bike
export const EditBikeButton = ({ bike, updateBike }: EditBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button icon={<EditOutlined />} onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <BikeFormModal
        open={isOpen}
        title={`Editing ${bike.brand} ${bike.model}`}
        okText="Save"
        initialBike={bike}
        onClose={() => setIsOpen(false)}
        // The form expects Promise<void>, updateBike resolves with another type
        onSubmit={async (input) => {
          await updateBike(input);
        }}
      />
    </>
  );
};