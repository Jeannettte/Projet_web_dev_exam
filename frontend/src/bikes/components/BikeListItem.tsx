import {
  EyeOutlined,
  TagOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import { formatPrice } from "../../shared/formatPrice";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

// One row of the catalogue (same layout as CustomerListItem)
export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={9}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ToolOutlined />
          {`${bike.brand} ${bike.model}`}
          {/* Lightning icon for electric bikes (same as the purchases list) */}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={6}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {bike.category}
        </Space>
      </Col>
      <Col span={5} style={{ fontWeight: "bold" }}>
        {formatPrice(bike.priceCents)}
      </Col>
      <Col span={4}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            {/* Link to the detail page: /bikes/<id> */}
            <ButtonLink to="/bikes/$bikeId" params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};