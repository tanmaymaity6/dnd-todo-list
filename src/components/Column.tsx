import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import type { Todo } from '../App';

interface ColumnProps {
  id: string;
  title: string;
  todos: Todo[];
}

export const Column: React.FC<ColumnProps> = ({ id, title, todos }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minHeight: '300px',
        background: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
      }}
    >
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      {todos.map((todo) => (
        <TaskCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
