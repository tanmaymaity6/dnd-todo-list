import React, {useState} from "react";
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {Column } from './Column';
import type { Todo } from "../App";
import { TrashArea } from "./TrashArea";



interface ToDoListProps {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>; 
}

export const ToDoList: React.FC<ToDoListProps> =({todos, setTodos}) => {
    const [input, setInput] = useState('');

    const addTodo =() => {
        if(!input.trim()) return;
        const newTodo: Todo = { id: Date.now(), text: input.trim(), status: 'to-do'};
        setTodos((prev) => [...prev, newTodo]);
        setInput('');
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active} = event;
        if(!over) return;

        if(over.id === 'trash') {
            setTodos((prev) => prev.filter((t) => t.id.toString()!== active.id));
            return;
        }

        const newStatus = over.id as Todo['status'];
        setTodos((prev) => 
            prev.map((t) => t.id.toString() === active.id ? {...t, status: newStatus}: t)
        );
     };
     return (
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ marginBottom: 20 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add new task..."
              style={{ padding: '8px', width: 200, marginRight: 10 }}
            />
            <button onClick={addTodo}>Add</button>
          </div>
    
          <div style={{ display: 'flex', gap: 20 }}>
            <Column id="to-do" title="To Do" todos={todos.filter(t => t.status === 'to-do')} />
            <Column id="in-progress" title="In Progress" todos={todos.filter(t => t.status === 'in-progress')} />
            <Column id="done" title="Done" todos={todos.filter(t => t.status === 'done')} />
          </div>
    
          <TrashArea />


        </DndContext>
      );
}


