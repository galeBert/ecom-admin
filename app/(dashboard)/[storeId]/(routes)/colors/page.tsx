import React from "react";
import prismadb from "@/lib/prismadb";
import { ColorsCol } from "./components/columns";

import { format } from "date-fns";
import ColorsClient from "./components/client";

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedColors: ColorsCol[] = colors.map((data) => ({
    ...data,
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient colors={formattedColors} />
      </div>
    </div>
  );
}
