'use client';
import { useQueryState } from 'nuqs';
import { ActionTypes } from '@/constants';

export function useBoardDialog() {
  const [mode, setMode] = useQueryState('mode', { defaultValue: '' });
  const [boardId, setBoardId] = useQueryState('board-id', { defaultValue: '' });

  const openCreateBoardDialog = async () => {
    await setBoardId('');
    await setMode(ActionTypes.Create);
  };

  const openEditBoardDialog = async (id: string) => {
    await setBoardId(id);
    await setMode(ActionTypes.Edit);
  };

  const closeBoardDialog = async () => {
    await setMode('');
    await setBoardId('');
  };

  return {
    mode,
    boardId,
    setMode,
    setBoardId,
    openCreateBoardDialog,
    openEditBoardDialog,
    closeBoardDialog,
    isOpen: !!mode,
  };
}
