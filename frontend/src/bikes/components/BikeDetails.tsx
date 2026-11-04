import { ArrowLeftOutlined, ToolOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { formatPrice } from "../../shared/formatPrice";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { DeleteBikeButton } from "./DeleteBikeButton";
import { EditBikeButton } from "./EditBikeButton";

interface BikeDetailsProps {
  bikeId: string;
}

// Detail page of a bike: specifications + edit and delete actions
export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike, deleteBike } =
    useBikeDetailsProvider(bikeId);
  const navigate = useNavigate();

  // Load the bike on first render and whenever the id in the URL changes
  useEffect(() => {
    load();
  }, [bikeId]);

  // Once deleted, this page no longer makes sense: go back to the catalogue.
  // If the API answers 409, the promise rejects and navigate is never called.
  const onDelete = (id: string) =>
    deleteBike(id).then(() => navigate({ to: "/bikes" }));

  // Skeleton while loading, "—" when the value is missing or empty
  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "brand", label: "Brand", children: value(bike?.brand) },
    { key: "model", label: "Model", children: value(bike?.model) },
    { key: "category", label: "Category", children: value(bike?.category) },
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches}"`),
    },
    { key: "gearCount", label: "Gears", children: value(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: "Electric",
      children: value(bike && (bike.electric ? "Yes" : "No")),
    },
    {
      key: "price",
      label: "Price",
      children: value(bike && formatPrice(bike.priceCents)),
    },
    {
      key: "description",
      label: "Description",
      // An empty description is displayed as "—"
      children: value(bike?.description || null),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ToolOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {/* The API answered 404 (or failed): bike is null */}
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      <Card
        title="Specifications"
        style={{ alignSelf: "stretch" }}
        extra={
          // Actions are only available once the bike is loaded
          bike && (
            <Space>
              <EditBikeButton bike={bike} updateBike={updateBike} />
              <DeleteBikeButton bike={bike} deleteBike={onDelete} withLabel />
            </Space>
          )
        }
      >
        <Descriptions column={{ xs: 1, md: 2 }} items={items} />
      </Card>
    </div>
  );
};