import { Suspense } from "react";
import BikeDetailView from "./BikeDetailView";
import BikeDetailSkeleton from "@/components/bikes/BikeDetailSkeleton";

export default function BikeDetailPage({ params }) {
  return (
    <Suspense fallback={<BikeDetailSkeleton />}>
      <BikeDetailView paramsPromise={params} />
    </Suspense>
  );
}
