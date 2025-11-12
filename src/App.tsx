import { useState } from 'react';
import { ToDoList } from './components/ToDoList';

export interface Todo {
  id: number;
  text: string;
  status: 'to-do' | 'in-progress' | 'done';
  createdAt: string;       
  completedAt?: string; 
  dueDate?: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "buy milk", status: "to-do", createdAt: new Date().toLocaleString() },
    { id: 2, text: "wash bike", status: "in-progress", createdAt: new Date().toLocaleString() },
    { id: 3, text: "do the budget", status: "done", createdAt: new Date().toLocaleString(), completedAt: new Date().toLocaleString() },
    { id: 4, text: "call jane", status: "to-do", createdAt: new Date().toLocaleString() },
  ]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Kanban To-Do List</h1>
      <ToDoList todos={todos} setTodos={setTodos} />
    </div>
  );
}
