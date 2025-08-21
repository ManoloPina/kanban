'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { Input } from '@/app/_components/ui/input';

import { type tasks } from '@/server/db/schema';

type Form = typeof tasks.$inferInsert & {
  subtasks: Subtask[];
};

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
} from '@/app/_components/ui/form';
import type { Subtask } from '@/model/board';

function EditTask({}) {
  const form = useForm<Form>();
  const { append, fields, update } = useFieldArray({
    control: form.control,
    name: 'subtasks',
  });
  return (
    <Form {...form}>
      <form>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default React.memo(EditTask);
