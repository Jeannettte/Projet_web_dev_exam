import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  // Must return the request so this component can display an error
  deleteBike: (id: string) => Promise<void>;
  // Shows the "Delete" label next to the icon (used on the detail page)
  withLabel?: boolean;
}

// Delete button + confirmation modal (same pattern as DeleteCustomerButton),
// with an error message when the API refuses the deletion
export const DeleteBikeButton = ({
  bike,
  deleteBike,
  withLabel = false,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setError(null);
    setIsOpen(false);
  };

  const onConfirm = () => {
    setIsDeleting(true);
    setError(null);
    deleteBike(bike.id)
      .then(close)
      .catch((err) => {
        // 409: the bike is linked to a sale, the sales history must be kept.
        // The modal stays open so the user understands why nothing happened.
        if (isAxiosError(err) && err.response?.status === 409)
          setError(
            "This bike is linked to existing sales and cannot be deleted.",
          );
        // 404: someone else already deleted it
        else if (isAxiosError(err) && err.response?.status === 404)
          setError("This bike no longer exists.");
        else setError("The bike could not be deleted. Please try again.");
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
        {withLabel && "Delete"}
      </Button>
      <Modal
        okButtonProps={{ danger: true }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={close}
        onOk={onConfirm}
        okText="Yes, delete"
        confirmLoading={isDeleting}
      >
        You are about to delete the bike {bike.brand} {bike.model}. This action
        cannot be undone, are you sure ?
        {error && (
          <div style={{ marginTop: 12 }}>
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        )}
      </Modal>
    </>
  );
};