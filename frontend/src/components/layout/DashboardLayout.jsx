import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-navy-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
