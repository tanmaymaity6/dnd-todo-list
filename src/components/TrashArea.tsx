import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const TrashArea: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash' });

  return (
    <div
      ref={setNodeRef}
      style={{
        marginTop: 30,
        textAlign: 'center',
        border: '2px dashed red',
        padding: '20px',
        backgroundColor: isOver ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
        transition: '0.2s ease',
      }}
    >
      Drag here to delete
    </div>
  );
};
