import React from "react";
import OrderClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { OrderCol } from "./components/columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";
export default async function OrderPage({
  params,
}: {
  params: { storeId: string };
}) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderCol[] = orders.map((data) => ({
    ...data,
    totalPrice: formatter.format(
      data.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    products: data.orderItems.map((item) => item.product.name).join(", "),
    createdAt: format(data.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
}
