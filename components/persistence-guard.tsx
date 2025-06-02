"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";

interface PersistenceGuardProps {
  children: React.ReactNode;
}

export function PersistenceGuard({ children }: PersistenceGuardProps) {
  const [isRehydrated, setIsRehydrated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if there's user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Dispatch action to set user in Redux store
        dispatch({ type: 'auth/setUser', payload: user });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
    setIsRehydrated(true);
  }, [dispatch]);

  if (!isRehydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}