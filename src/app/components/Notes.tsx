"use client";

import React from "react";
import { useNotes } from "@/app/contexts/NotesContext";

interface NotesProps {
  className?: string;
}

function Notes({ className = "" }: NotesProps) {
  const { notes } = useNotes();

  return (
    <div className={`flex flex-col bg-white rounded-xl ${className}`}>
      <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-10 text-base border-b bg-white rounded-t-xl">
        <span className="font-semibold">Tutoring Notes</span>
      </div>

      <div className="overflow-auto p-4 flex flex-col gap-y-3 h-full">
        {notes.length === 0 ? (
          <div className="text-gray-500 text-center italic">
            Notes will appear here as you complete each step of the problem
          </div>
        ) : (
          notes
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((note) => (
              <div key={note.stepNumber} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-sm text-gray-700">
                    Step {note.stepNumber}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {note.description}
                </div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {note.updatedExpression}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Notes;