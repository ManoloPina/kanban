import React from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import { X } from 'lucide-react';
import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
} from '@/app/_components/ui/form';

import type { Subtask } from '@/model/board';
import { type Control, type UseFieldArrayUpdate } from 'react-hook-form';

interface Props {
  control: Control<Subtask>;
  update: UseFieldArrayUpdate<Subtask>;
  index: number;
  value: Subtask;
}

function SubtaskEdit({ control, update, index, value }: Props) {
  return (
    <div className="flex flex-row">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button variant="ghost">
        <X className="size-4" />
      </Button>
    </div>
  );
}
export default React.memo(SubtaskEdit);
