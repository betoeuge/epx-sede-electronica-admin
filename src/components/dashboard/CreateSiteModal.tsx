"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCreateSite } from "@/hooks/useSites";
import type { SiteGroupResponse } from "@/types/sites.types";

const ACCENT_COLORS = [
  "#94bb5f",
  "#bf363b",
  "#d19d4d",
  "#e87148",
  "#415998",
  "#464289",
];

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: z.string().max(500).optional(),
  accentColor: z.string().optional(),
  groupId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groups: SiteGroupResponse[];
  defaultGroupId?: string;
}

export function CreateSiteModal({ isOpen, onClose, groups, defaultGroupId }: Props) {
  const { mutateAsync, isPending, error } = useCreateSite();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      accentColor: ACCENT_COLORS[0],
      groupId: defaultGroupId ?? "",
    },
  });

  const nameValue = watch("name");
  const accentColor = watch("accentColor");

  // Auto-generate slug from name
  useEffect(() => {
    setValue("slug", toSlug(nameValue ?? ""), { shouldValidate: false });
  }, [nameValue, setValue]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  async function onSubmit(values: FormValues) {
    const newSite = await mutateAsync({
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      accentColor: values.accentColor || undefined,
      groupId: values.groupId || undefined,
    });
    router.push(`/templates?site=${newSite.id}`);
    onClose();
  }

  const groupOptions = [
    { value: "", label: "Sin grupo" },
    ...groups.map((g) => ({ value: g.id, label: g.name })),
  ];

  const errorMessage =
    error instanceof Error ? error.message : error ? "Error al crear el sitio" : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proyecto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nombre del sitio"
          placeholder="Ej. Ministerio de Educación"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Slug (URL)"
          placeholder="ministerio-educacion"
          hint="Solo minúsculas, números y guiones"
          error={errors.slug?.message}
          {...register("slug")}
        />

        <Input
          label="Descripción"
          placeholder="Descripción breve (opcional)"
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Color picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#bdbdbd] text-sm font-medium">Color de acento</label>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("accentColor", color)}
                className="size-8 rounded-full transition-all"
                style={{
                  background: color,
                  outline: accentColor === color ? `3px solid white` : "none",
                  outlineOffset: "2px",
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        <Select
          label="Grupo"
          options={groupOptions}
          {...register("groupId")}
        />

        {errorMessage && (
          <p className="text-[#eb5757] text-sm">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="brand" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner size="sm" />
                Creando…
              </>
            ) : (
              "Crear Sitio"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
