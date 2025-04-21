import { use } from "react";
import { CarDetailsContent } from "@/src/components/car-details-content";

export default function CarDetailsPage({ params }: { params: Promise<{ userId: string, id: string }> }) {
  const resolvedParams = use(params);
  return <CarDetailsContent userId={resolvedParams.userId} carId={resolvedParams.id} />;
}
