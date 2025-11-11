import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Todo } from '../App';

interface TaskCardProps {
  todo: Todo;
}

export const TaskCard: React.FC<TaskCardProps> = ({ todo }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id.toString(),
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '8px 12px',
    marginBottom: 8,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {todo.text}
    </div>
  );
};
