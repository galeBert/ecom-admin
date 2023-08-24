import React from "react";
import BillBoardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { CategoriesCol } from "./components/columns";

import { format } from "date-fns";

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoriesCol[] = categories.map((data) => ({
    ...data,
    billboardLabel: data.billboard.label,
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient categories={formattedCategories} />
      </div>
    </div>
  );
}
