'use client';
import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '@/trpc/react';

import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import { Textarea } from '@/app/_components/ui/textarea';
import { X, Plus, LoaderCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/app/_components/ui/form';
import type { Task } from '@/model/board';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { taskSchema } from '@/model/task';
import type z from 'zod';
import { ActionTypes } from '@/constants';

interface Props {
  boardId: string;
  task?: Task;
  mode: string;
}

type Form = z.infer<typeof taskSchema>;

function TaskForm({ task, boardId, mode }: Props) {
  const form = useForm<Form>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      columnId: task?.columnId,
      subtasks: [],
    },
  });

  const utils = api.useUtils();

  const { data: columns, isLoading: isLoadingColumns } =
    api.column.getColumnsByBoardId.useQuery(boardId);

  const { mutate: updateTask, isPending: isPendingTaskUpdate } =
    api.task.updateTask.useMutation({
      onSuccess: async () => {
        toast.success('Task updated');
        await utils.board.getBoardById.invalidate(boardId);
      },
      onError: (err) => {
        toast.error(`Was not possible to updated the task: ${err?.message}`);
      },
    });

  const { mutate: createTask, isPending: isPendingCreateTask } =
    api.task.createTask.useMutation({
      onSuccess: async (data) => {
        toast.success('A new task was created');
        await utils.board.getBoardById.invalidate(boardId);
        await utils.column.getColumnsByBoardId.invalidate(boardId);
        form.reset({
          title: '',
          description: '',
          columnId: '',
          subtasks: [],
        });
      },
      onError: (err) => {
        toast.error('Was not possible to create the task', {
          description: err?.message || 'Unknown error',
        });
      },
    });

  const { append, fields, update, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks',
  });

  const handleAddNewSubTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    append({ title: '' });
  };

  const handleRemoveSubtask =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      remove(index);
    };

  const handleSubmit = (data: Form) => {
    if (mode === `${ActionTypes.Edit}` && task) {
      updateTask({ id: task.id, ...data });
    } else if (mode === `${ActionTypes.Create}`) {
      createTask(data);
    }
  };

  const isLoading = useMemo(
    () => isPendingTaskUpdate || isPendingCreateTask,
    [isPendingCreateTask, isPendingTaskUpdate],
  );

  useEffect(() => {
    if (
      !!(mode === `${ActionTypes.Edit}` || mode === `${ActionTypes.Create}`) &&
      task
    ) {
      console.log('columnId:', task.columnId);
      form.reset({
        ...task,
        columnId: task.columnId,
        subtasks:
          task.subtasks?.map((subtask) => ({
            id: subtask.id,
            title: subtask.title,
          })) ?? [],
      });
    } else if (mode === `${ActionTypes.Create}`) {
      form.reset({
        title: '',
        description: '',
        columnId: '',
        subtasks: [],
      });
    }
  }, [task, form, mode, columns]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ul className="flex flex-col gap-3">
          <span className="">Subtasks</span>
          {fields.map((item, index) => (
            <li key={item.id} className="flex w-full flex-row gap-2">
              <FormField
                disabled={isLoading}
                name={`subtasks.${index}.title`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className=""
                variant="ghost"
                onClick={handleRemoveSubtask(index)}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
          <Button
            disabled={isLoading}
            size="lg"
            className="text-primary flex flex-row items-center rounded-full
              bg-white hover:text-white"
            onClick={handleAddNewSubTask}
          >
            <Plus className="size-4" />
            <span>Add New Subtask</span>
          </Button>
        </ul>

        <FormField
          name="columnId"
          disabled={isLoading}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {columns?.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="rounded-full"
          size="lg"
        >
          {isLoading ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default React.memo(TaskForm);
