import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-login-layout">
      {children}
    </div>
  );
}