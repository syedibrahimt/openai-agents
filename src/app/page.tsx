import React, { Suspense } from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import { NotesProvider } from "@/app/contexts/NotesContext";
import App from "./App";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptProvider>
        <EventProvider>
          <NotesProvider>
            <App />
          </NotesProvider>
        </EventProvider>
      </TranscriptProvider>
    </Suspense>
  );
}
