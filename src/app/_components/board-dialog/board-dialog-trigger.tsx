'use client';

import { Button } from '@/app/_components/ui/button';
import { useBoardDialog } from '@/hooks';
import { ActionTypes } from '@/constants';
import { cn } from '@/lib/utils';

interface BoardDialogTriggerProps extends React.ComponentProps<typeof Button> {
  mode?: ActionTypes.Create | ActionTypes.Edit;
  boardId?: string;
}

export function BoardDialogTrigger({
  mode = ActionTypes.Create,
  boardId,
  children,
  className,
  disabled,
  ...buttonProps
}: BoardDialogTriggerProps) {
  const {
    openCreateBoardDialog,
    openEditBoardDialog,
    mode: currentMode,
    isOpen,
  } = useBoardDialog();

  const handleClick = async () => {
    if (mode === ActionTypes.Edit && boardId) {
      await openEditBoardDialog(boardId);
    } else {
      await openCreateBoardDialog();
    }
  };

  return (
    <Button
      type="button"
      className={cn(className)}
      onClick={() => void handleClick()}
      disabled={(isOpen && currentMode === mode) || disabled}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
