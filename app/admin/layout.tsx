import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bayside Fine Jewelry',
  description: 'Admin dashboard for Bayside Fine Jewelry',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout min-h-screen">
      {children}
    </div>
  );
}