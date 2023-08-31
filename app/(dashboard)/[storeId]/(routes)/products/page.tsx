import React from "react";
import prismadb from "@/lib/prismadb";
import { ProductCol } from "./components/columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/client";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      size: true,
      category: true,
      color: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedBillboards: ProductCol[] = products.map((data) => ({
    ...data,
    price: formatter.format(data.price.toNumber()),
    category: data.category.name,
    size: data.size.name,
    color: data.color.name,
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formattedBillboards} />
      </div>
    </div>
  );
}
