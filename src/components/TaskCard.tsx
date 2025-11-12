import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Todo } from '../App';

interface TaskCardProps {
  todo: Todo;
  onEdit: (id: number, newText: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ todo, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id.toString(),
    disabled: isEditing,
  });

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => setIsEditing(true);

  // 🕓 Determine due-date status
  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time
  const due = todo.dueDate ? new Date(todo.dueDate) : null;

  const isDueToday =
    due &&
    todo.status !== 'done' &&
    due.toDateString() === new Date().toDateString();

  const isOverdue =
    due && todo.status !== 'done' && due < today;

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() && text !== todo.text) {
      onEdit(todo.id, text.trim());
    } else {
      setText(todo.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') inputRef.current?.blur();
  };

  // 🎨 Styling for overdue / due today / normal
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    background: '#fff',
    border: isOverdue
      ? '2px solid red'
      : isDueToday
      ? '2px solid orange'
      : '1px solid #ccc',
    borderRadius: 6,
    padding: '8px 12px',
    marginBottom: 8,
    cursor: isEditing ? 'text' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...(!isEditing ? listeners : {})}
      {...attributes}
      style={style}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: 4,
            fontSize: 14,
            border: 'none',
            outline: '1px solid #ddd',
          }}
        />
      ) : (
        <>
          <div>{todo.text}</div>

          {/* Created */}
          <small style={{ display: 'block', color: '#666', marginTop: 4 }}>
            🕓 Created: {todo.createdAt}
          </small>

          {/* Completed */}
          {todo.completedAt && (
            <small style={{ display: 'block', color: 'green' }}>
              ✅ Completed: {todo.completedAt}
            </small>
          )}

          {/* Due Date */}
          {todo.dueDate && (
            <small
              style={{
                display: 'block',
                color: isOverdue
                  ? 'red'
                  : isDueToday
                  ? 'orange'
                  : '#333',
                marginTop: 4,
              }}
            >
              📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
            </small>
          )}
        </>
      )}
    </div>
  );
};
