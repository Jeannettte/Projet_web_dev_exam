import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";
import { BikeFormModal } from "./BikeFormModal";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

// "Add bike" button + creation modal (same pattern as AddCustomerButton)
export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add bike
      </Button>
      {/* No initialBike: the form starts empty */}
      <BikeFormModal
        open={isOpen}
        title="New bike"
        okText="Add bike"
        onClose={() => setIsOpen(false)}
        onSubmit={createBike}
      />
    </>
  );
};