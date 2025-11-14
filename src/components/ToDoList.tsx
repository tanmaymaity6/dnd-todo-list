import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Column } from "./Column";
import { TrashArea } from "./TrashArea";
import type { Todo } from "../App";

interface ToDoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const ToDoList: React.FC<ToDoListProps> = ({ todos, setTodos }) => {
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false); // 🔍 filter state

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      status: "to-do",
      createdAt: new Date().toLocaleString(),
      dueDate: dueDate || undefined,
    };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
    setDueDate("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    if (over.id === "trash") {
      setTodos((prev) => prev.filter((t) => t.id.toString() !== active.id));
      return;
    }

    const newStatus = over.id as Todo["status"];
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id.toString() === active.id) {
          const wasDone = t.status === "done";
          const nowDone = newStatus === "done";
          return {
            ...t,
            status: newStatus,
            completedAt:
              !wasDone && nowDone
                ? new Date().toLocaleString()
                : !nowDone
                ? undefined
                : t.completedAt,
          };
        }
        return t;
      })
    );
  };

  const handleEdit = (id: number, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const filteredTodos = showOverdueOnly
    ? todos.filter(
        (t) =>
          t.dueDate &&
          t.status !== "done" &&
          new Date(t.dueDate) < new Date()
      )
    : todos;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task..."
          style={{ padding: "8px", width: 200 }}
        />

        {/* 🗓️ Due Date input with label */}
        <label style={{ fontWeight: 500 }}>
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: "8px", marginLeft: 6 }}
          />
        </label>

        <button type="submit">Add</button>

        <button
          type="button"
          onClick={() => setShowOverdueOnly((prev) => !prev)}
          style={{
            marginLeft: 10,
            background: showOverdueOnly ? "#c00" : "#ccc",
            color: showOverdueOnly ? "white" : "black",
            padding: "8px 12px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {showOverdueOnly ? "Show All" : "Show Overdue Only"}
        </button>
      </form>

      <div style={{ display: "flex", gap: 20 }}>
        <Column
          id="to-do"
          title="To Do"
          todos={filteredTodos.filter((t) => t.status === "to-do")}
          onEdit={handleEdit}
        />
        <Column
          id="in-progress"
          title="In Progress"
          todos={filteredTodos.filter((t) => t.status === "in-progress")}
          onEdit={handleEdit}
        />
        <Column
          id="done"
          title="Done"
          todos={filteredTodos.filter((t) => t.status === "done")}
          onEdit={handleEdit}
        />
      </div>

      <TrashArea />
    </DndContext>
  );
};
