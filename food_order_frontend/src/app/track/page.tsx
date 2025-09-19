"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderTracker } from "@/components/OrderTracker";

function TrackerInner() {
  const params = useSearchParams();
  const order = params.get("order") || undefined;
  return <OrderTracker initialOrderNumber={order} />;
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading tracker…</div>}>
      <TrackerInner />
    </Suspense>
  );
}
