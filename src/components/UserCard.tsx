import React from 'react';
import { Badge } from './ui/badge';

interface UserCardProps {
  username: string;
  initials: string;
}

export function UserCard({ username, initials }: UserCardProps) {
  return (
    <div className="p-4 bg-secondary border border-border rounded-xl">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-1 bg-success/10 text-success border-success/20">
            Cuenta activa
          </Badge>
          <p className="text-foreground truncate" style={{ fontSize: '14px', fontWeight: 500 }}>
            {username}
          </p>
        </div>
      </div>
    </div>
  );
}