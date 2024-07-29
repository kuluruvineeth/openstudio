import { Toaster as SonnerToaster, toast } from "sonner";

export function toastSuccess(options: { title?: string; description: string }) {
  return toast.success(options.title || "Success", {
    description: options.description,
  });
}

export function toastError(options: { title?: string; description: string }) {
  return toast.error(options.title || "Error", {
    description: options.description,
  });
}

export function toastInfo(options: { title: string; description: string }) {
  return toast(options.title, { description: options.description });
}

export function toastLoading(options: { title?: string; description: string }) {
  return toast.loading(options.description, {
    duration: 3000,
  });
}

export const Toaster = SonnerToaster;
