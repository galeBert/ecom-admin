import React from "react";
import BillBoardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { BillboardCol } from "./components/columns";

import { format } from "date-fns";
export default async function BillboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedBillboards: BillboardCol[] = billboards.map((data) => ({
    ...data,
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
}
