"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({});

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }: TabsProps) {
  const [selected, setSelected] = React.useState(value ?? defaultValue ?? "");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (value === undefined) {
        setSelected(val);
      }
      onValueChange?.(val);
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: selected, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-slate-900/80 p-1 text-slate-400 border border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, onClick, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-emerald-600 text-white shadow-sm font-semibold"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
        className
      )}
      onClick={(e) => {
        context.onValueChange?.(value);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500", className)}
      {...props}
    >
      {children}
    </div>
  );
}
