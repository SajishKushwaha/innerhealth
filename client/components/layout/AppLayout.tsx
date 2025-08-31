import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Chatbot from "../ai/Chatbot";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div className="min-h-screen min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          {children ?? <Outlet />}
        </main>
        <Chatbot />
      </div>
    </div>
  );
}
