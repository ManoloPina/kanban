'use client';
import React from 'react';
import { useForm, useFieldArray, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/_components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useBoardDialog } from '@/hooks';
//Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { Plus, X, LoaderCircle } from 'lucide-react';
//Types
import { boardFormSchema, boardUpdateSchema, type IBoard } from '@/model/board';
import { type z } from 'zod';

interface Props {
  board?: IBoard | null;
}

type CreateForm = z.infer<typeof boardFormSchema>;
type UpdateForm = z.infer<typeof boardUpdateSchema>;

function BoardForm({ board = null }: Props) {
  const isEditing = !!board?.id;

  const utils = api.useUtils();
  const router = useRouter();
  const { closeBoardDialog } = useBoardDialog();

  const create = api.board.createBoard.useMutation({
    onSuccess: async (createdBoard) => {
      await utils.board.getBoards.invalidate();
      if (createdBoard) {
        toast.success(`Board ${createdBoard.name} created successfully`);
        await closeBoardDialog();
        router.push(`/board/${createdBoard.id}`);
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'Was not possible to create the board');
    },
  });

  const update = api.board.updateBoard.useMutation({
    onSuccess: async (updatedBoard) => {
      await Promise.all([
        utils.board.getBoards.invalidate(),
        utils.board.getBoardById.invalidate(board!.id),
      ]);
      toast.success(
        `Board ${updatedBoard?.name ?? board!.name} updated successfully`,
      );
      await closeBoardDialog();
    },
    onError: (err) =>
      toast.error(err.message ?? 'Was not possible to update the board'),
  });

  const isPending = isEditing ? update.isPending : create.isPending;

  const schema = isEditing ? boardUpdateSchema : boardFormSchema;

  const form = useForm<CreateForm | UpdateForm>({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? {
          id: board.id,
          name: board.name,
          columns: board.columns.map((c) => ({ id: c.id, name: c.name })),
        }
      : { name: '', columns: [{ name: '' }] },
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'columns',
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    append({ name: '' });
  };

  const handleSubmit = (data: CreateForm | UpdateForm) => {
    if (isEditing) {
      update.mutate({ id: board.id, ...data });
    } else {
      create.mutate(data);
    }
  };

  const onInvalid = (errors: FieldErrors<CreateForm | UpdateForm>) => {
    console.log('🔴 Validation errors:', errors);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(...args) =>
          form.handleSubmit(handleSubmit, onInvalid)(...args)
        }
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Web Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ul className="flex flex-col gap-3">
          <span className="text-xs font-bold">Board Columns</span>
          {fields.map((item, index) => (
            <li key={item.id} className="flex w-full flex-row gap-2">
              <FormField
                name={`columns.${index}.name`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        onKeyDown={handleKeyDown}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button variant="ghost" onClick={() => remove(index)}>
                  <X className="size-4" />
                </Button>
              )}
            </li>
          ))}
          <Button
            className="text-primary flex flex-row items-center rounded-full
              bg-white hover:text-white"
            onClick={() => append({ name: '' })}
          >
            <Plus className="size-4" />
            <span>Add New Column</span>
          </Button>
        </ul>
        <Button
          size="lg"
          type="submit"
          disabled={isPending}
          className="flex items-center rounded-full"
        >
          {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          {isEditing ? 'Save Changes' : 'Create New Board'}
        </Button>
      </form>
    </Form>
  );
}

export default React.memo(BoardForm);
