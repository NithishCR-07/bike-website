import { Suspense } from "react";
import BikeDetailView from "./BikeDetailView";

export default function BikeDetailPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <BikeDetailView paramsPromise={params} />
    </Suspense>
  );
}
