"use client";

import { useCallback, useState, type Dispatch, type PointerEvent, type SetStateAction } from "react";

export function useDragReorder<T extends { id: number }>(
  setItems: Dispatch<SetStateAction<T[]>>,
) {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>, id: number) => {
      e.preventDefault();
      setDraggedId(id);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (draggedId === null) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const row = (el as HTMLElement | null)?.closest<HTMLElement>(
        "[data-drag-row]",
      );
      if (!row) return;
      const overId = Number(row.dataset.dragRow);
      if (!overId || overId === draggedId) return;
      setItems((prev) => {
        const from = prev.findIndex((it) => it.id === draggedId);
        const to = prev.findIndex((it) => it.id === overId);
        if (from === -1 || to === -1 || from === to) return prev;
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    },
    [draggedId, setItems],
  );

  const onPointerUp = useCallback(() => {
    setDraggedId(null);
  }, []);

  return { draggedId, onPointerDown, onPointerMove, onPointerUp };
}
