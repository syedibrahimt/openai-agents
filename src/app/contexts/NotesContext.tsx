"use client";

import React, {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
} from "react";

export interface NoteItem {
  stepNumber: number;
  description: string;
  updatedExpression: string;
  timestamp: string;
  createdAtMs: number;
}

type NotesContextValue = {
  notes: NoteItem[];
  addNote: (stepNumber: number, description: string, updatedExpression: string) => void;
  updateNote: (stepNumber: number, description: string, updatedExpression: string) => void;
  clearNotes: () => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  function newTimestampPretty(): string {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ms = now.getMilliseconds().toString().padStart(3, "0");
    return `${time}.${ms}`;
  }

  const addNote: NotesContextValue["addNote"] = (stepNumber, description, updatedExpression) => {
    setNotes((prev) => {
      // Check if note for this step already exists
      const existingIndex = prev.findIndex(note => note.stepNumber === stepNumber);
      
      const newNote: NoteItem = {
        stepNumber,
        description,
        updatedExpression,
        timestamp: newTimestampPretty(),
        createdAtMs: Date.now(),
      };

      if (existingIndex >= 0) {
        // Update existing note
        const updated = [...prev];
        updated[existingIndex] = newNote;
        return updated;
      } else {
        // Add new note
        return [...prev, newNote];
      }
    });
  };

  const updateNote: NotesContextValue["updateNote"] = (stepNumber, description, updatedExpression) => {
    addNote(stepNumber, description, updatedExpression); // Same logic as addNote
  };

  const clearNotes: NotesContextValue["clearNotes"] = () => {
    setNotes([]);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        clearNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}