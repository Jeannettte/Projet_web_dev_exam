import {
  CalendarOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Col, Skeleton, Space } from "antd";
import { ListItem } from "../../shared/components/ListItem";
import type { PurchaseModel } from "../models/PurchaseModel";

interface CustomerPurchaseListItemProps {
  // No purchase means it is still loading: the row keeps its shape with placeholders
  purchase?: PurchaseModel;
}

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { dateStyle: "medium" });

export const CustomerPurchaseListItem = ({
  purchase,
}: CustomerPurchaseListItemProps) => {
  const placeholder = <Skeleton.Input active size="small" />;

  return (
    <ListItem>
      <Col span={10}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShoppingOutlined />
          {purchase ? (
            <>
              {/* The bike name links to its detail page (/bikes/<id>).
                  The link can never point to a deleted bike: a bike linked
                  to a sale cannot be deleted (409). */}
              <Link to="/bikes/$bikeId" params={{ bikeId: purchase.bikeId }}>
                {`${purchase.bike.brand} ${purchase.bike.model}`}
              </Link>
              {purchase.bike.electric && (
                <ThunderboltOutlined aria-label="Electric" />
              )}
            </>
          ) : (
            placeholder
          )}
        </Space>
      </Col>
      <Col span={6}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <CalendarOutlined />
          {purchase ? formatDate(purchase.soldAt) : placeholder}
        </Space>
      </Col>
      <Col span={4}>
        {purchase
          ? `${purchase.quantity} × ${formatPrice(purchase.unitPriceCents)}`
          : placeholder}
      </Col>
      <Col span={4} style={{ textAlign: "right", fontWeight: "bold" }}>
        {purchase
          ? formatPrice(purchase.quantity * purchase.unitPriceCents)
          : placeholder}
      </Col>
    </ListItem>
  );
};