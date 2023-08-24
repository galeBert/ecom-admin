import prismadb from "@/lib/prismadb";
import React from "react";
import SizesForm from "./components/sizes-form";

interface SizesPageProps {
  params: {
    sizeId: string;
  };
}
export default async function BillBoardPage({ params }: SizesPageProps) {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} />
      </div>
    </div>
  );
}
