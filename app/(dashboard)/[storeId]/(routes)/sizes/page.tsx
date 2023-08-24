import React from "react";
import prismadb from "@/lib/prismadb";
import { SizesCol } from "./components/columns";

import { format } from "date-fns";
import SizesClient from "./components/client";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizesCol[] = sizes.map((data) => ({
    ...data,
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient sizes={formattedSizes} />
      </div>
    </div>
  );
}
