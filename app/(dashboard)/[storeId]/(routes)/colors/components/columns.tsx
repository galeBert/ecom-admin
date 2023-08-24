"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import CellAction from "./cell-action";

export type ColorsCol = {
  id: string;
  value: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorsCol>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6  rounded-full border"
          style={{ backgroundColor: row.original.value }}
        ></div>
      </div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return <CellAction data={data} />;
    },
  },
];
