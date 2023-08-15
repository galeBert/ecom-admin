import prismadb from "@/lib/prismadb";
import React from "react";
import BillboardForm from "./components/billboards-form";

interface BillboardPageProps {
  params: {
    billboardId: string;
  };
}
export default async function BillBoardPage({ params }: BillboardPageProps) {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
