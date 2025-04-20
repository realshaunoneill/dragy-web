import { use } from "react";
import { CarDetailsContent } from "@/src/components/car-details-content";

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <CarDetailsContent id={resolvedParams.id} />;
}
