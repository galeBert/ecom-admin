"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";

import * as z from "zod";
import { Billboard, Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
  initialData: Billboard | null;
}
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type SettingsFromValues = z.infer<typeof formSchema>;

export default function BillboardForm({ initialData }: BillboardFormProps) {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard." : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SettingsFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: SettingsFromValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        axios.post(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      }

      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = () => {
    try {
      setIsLoading(true);
      axios.delete(`/api/${params.storeId}/billboard/${params.billboardId}`);
      router.refresh();
      router.push(`/api/${params.storeId}/billboard`);
      toast.success("Billboard Deleted");
    } catch (error) {
      toast.error(
        "Make sure you remove all categories using this billboard first"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        loading={isLoading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            disabled={isLoading}
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="label"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Billboard label"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
