import { createFileRoute } from "@tanstack/react-router";
import { BikeDetailsPage } from "../../bikes/pages/BikeDetailsPage";

// URL: /bikes/<id>. The "$" in the file name makes bikeId a route parameter.
export const Route = createFileRoute("/bikes/$bikeId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bikeId } = Route.useParams();
  return <BikeDetailsPage bikeId={bikeId} />;
}