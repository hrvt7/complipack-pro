import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth - replace with Supabase when ready
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('complipack-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists (mock)
    const users = JSON.parse(localStorage.getItem('complipack-users') || '[]');
    if (users.find((u: User) => u.email === email)) {
      return { error: 'An account with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      fullName,
      createdAt: new Date().toISOString(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem('complipack-users', JSON.stringify(users));
    localStorage.setItem('complipack-user', JSON.stringify(newUser));
    setUser(newUser);

    return { error: null };
  };

  const signIn = async (email: string, password: string, rememberMe = false): Promise<{ error: string | null }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('complipack-users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      return { error: 'Incorrect email or password' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    
    if (rememberMe) {
      localStorage.setItem('complipack-user', JSON.stringify(userWithoutPassword));
    } else {
      sessionStorage.setItem('complipack-user', JSON.stringify(userWithoutPassword));
    }
    
    setUser(userWithoutPassword);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('complipack-user');
    sessionStorage.removeItem('complipack-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
