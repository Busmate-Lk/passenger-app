import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import demoCredentials from '../data/demoCredentials.json';
import demoUserData from '../data/demoUserData.json';

// Modified to handle image sources from require
type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage: any; // Changed to 'any' to handle both URLs and require statements
  memberSince?: string;
  dob?: string;
  address?: string;
  city?: string;
  totalTrips?: number;
  savedRoutes?: number;
  preferences?: {
    language: string;
    notifications: {
      bookingUpdates: boolean;
      promotions: boolean;
      serviceAlerts: boolean;
    };
    accessibility: {
      largeText: boolean;
      highContrast: boolean;
    };
  };
  wallet?: {
    balance: number;
    cardNumber: string;
    expiryDate: string;
    name: string;
    recentTransactions: any[];
  };
  tickets?: any[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing login
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Find user in the demo data
          const userData = demoUserData.users.find(u => u.id === userId);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials against demo data
    const foundCredentials = demoCredentials.users.find(
      u => u.email === email && u.password === password
    );
    
    if (foundCredentials) {
      // Get the complete user data from demoUserData
      const completeUserData = demoUserData.users.find(u => u.id === foundCredentials.id);
      
      if (completeUserData) {
        // Store user ID instead of the whole object
        await AsyncStorage.setItem('userId', completeUserData.id);
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setUser(completeUserData);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    // Clear stored user data
    await AsyncStorage.removeItem('userId');
    setUser(null);
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};