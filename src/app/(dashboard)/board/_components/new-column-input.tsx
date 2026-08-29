'use client';

import { api } from '@/trpc/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { columnNameSchema } from '@/model/column';
import { cn } from '@/lib/utils';

interface Props {
  boardId: string;
}

const MAX_COLUMN_NAME_LENGTH = 50;

export function NewColumnInput({ boardId }: Props) {
  const utils = api.useUtils();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createColumn, isPending } =
    api.column.createColumn.useMutation({
      onSuccess: async () => {
        utils.board.getBoardById.invalidate(boardId);
        toast.success('Column created');
        setName('');
        setIsFocused(false);
      },
      onError: (err) => {
        toast.error(err.message ?? 'Could not create column');
        inputRef.current?.focus();
      },
    });

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setName('');
      setIsFocused(false);
      return;
    }

    const result = columnNameSchema.safeParse({ name: trimmed });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Invalid column name');
      inputRef.current?.focus();
      return;
    }

    createColumn({ name: result.data.name, boardId });
  };

  const handleCancel = () => {
    setName('');
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    if (!name.trim()) {
      handleCancel();
    }
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        `font-jakarta mt-4 flex h-[calc(100dvh-200px)] w-70 shrink-0 cursor-text
        items-center justify-center rounded-md bg-linear-to-b from-[#2B2C37]
        to-[#2B2C37]/50 pt-10 text-2xl font-bold transition-all`,
        isFocused || name
          ? 'bg-background text-foreground border-border border shadow-sm'
          : 'text-muted-foreground',
      )}
    >
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        placeholder={isFocused ? 'Column name' : '+ New Column'}
        disabled={isPending}
        maxLength={MAX_COLUMN_NAME_LENGTH}
        className="placeholder:text-muted-foreground w-full bg-transparent
          text-center outline-none"
      />
    </div>
  );
}
