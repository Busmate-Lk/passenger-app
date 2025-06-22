import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('kavinda@busmate.lk'); // Pre-filled for demo
  const [password, setPassword] = useState('123'); // Pre-filled for demo
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await signIn(email, password);
    
    if (success) {
      // Store onboarding completion
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-lg text-gray-600">Sign in to continue your journey</Text>
        </View>

        <View className="space-y-6 mb-8">
          <View>
            <Text className="text-base font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base"
            />
          </View>

          <View>
            <Text className="text-base font-medium text-gray-700 mb-2">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 pr-12 text-base"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/auth/forgot-password')}
          className="self-end mb-8"
        >
          <Text className="text-primary text-base font-medium">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center mb-6 ${
            isLoading ? 'bg-gray-400' : 'bg-primary'
          }`}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600 text-base">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text className="text-primary text-base font-medium">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}