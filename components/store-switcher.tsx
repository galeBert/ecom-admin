"use client";

import React, { ComponentPropsWithoutRef, useState } from "react";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { CommandSeparator } from "cmdk";

type PopOverTriggerProps = ComponentPropsWithoutRef<typeof Popover>;

interface StoreSwitcherProps extends PopOverTriggerProps {
  items: Store[];
  className?: string;
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const [isOpen, setisOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentItems = formattedItems.find(
    (currItem) => currItem.value === params.storeId
  );

  const onStoreSelect = (store: { label: string; value: string }) => {
    setisOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setisOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Select a store"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="w-4 h-4 mr-2" />
          {currentItems?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No Store Found</CommandEmpty>
            <CommandGroup heading="stores">
              {formattedItems.map((formattedItem) => {
                return (
                  <CommandItem
                    key={formattedItem.value}
                    onSelect={() => onStoreSelect(formattedItem)}
                  >
                    <StoreIcon className="w-4 h-4 mr-2" />

                    {formattedItem.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentItems?.value === formattedItem.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setisOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
