"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCreateSiteGroup } from "@/hooks/useSites";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: Props) {
  const { mutateAsync, isPending, error } = useCreateSiteGroup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  async function onSubmit(values: FormValues) {
    await mutateAsync({ name: values.name, sortOrder: 0 });
    onClose();
  }

  const errorMessage =
    error instanceof Error ? error.message : error ? "Error al crear el grupo" : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Grupo">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nombre del grupo"
          placeholder="Ej. Ministerios Colombia"
          error={errors.name?.message}
          {...register("name")}
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
              "Crear Grupo"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
