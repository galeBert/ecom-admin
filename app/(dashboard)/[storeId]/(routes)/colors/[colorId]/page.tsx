import prismadb from "@/lib/prismadb";
import React from "react";
import ColorsForm from "./components/colors-form";

interface ColorsPageProps {
  params: {
    colorId: string;
  };
}
export default async function BillBoardPage({ params }: ColorsPageProps) {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color} />
      </div>
    </div>
  );
}
