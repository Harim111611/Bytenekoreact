import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  delta?: string;
  deltaPositive?: boolean;
}

export function KPICard({ label, value, icon: Icon, delta, deltaPositive }: KPICardProps) {
  return (
    <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-md group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-2 text-sm">{label}</p>
          <p className="text-foreground transition-all duration-300 group-hover:scale-105" style={{ fontSize: '28px', fontWeight: 600, lineHeight: 1.2 }}>{value}</p>
          {delta && (
            <p 
              className={`mt-2 ${deltaPositive ? 'text-success' : 'text-destructive'}`}
              style={{ fontSize: '14px' }}
            >
              {delta}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 bg-secondary rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/10">
            <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
          </div>
        )}
      </div>
    </Card>
  );
}