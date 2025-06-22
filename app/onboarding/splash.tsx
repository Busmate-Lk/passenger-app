import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/language');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#004CFF', '#0066FF']}
      className="flex-1 justify-center items-center"
    >
      <View className="items-center">
        <View className="w-24 h-24 bg-white rounded-full justify-center items-center mb-8">
          <Text className="text-4xl">🚌</Text>
        </View>
        <Text className="text-white text-3xl font-bold mb-2">SmartBus</Text>
        <Text className="text-white/80 text-lg">Sri Lanka</Text>
      </View>
      
      <View className="absolute bottom-16">
        <Text className="text-white/60 text-sm">Your Smart Journey Starts Here</Text>
      </View>
    </LinearGradient>
  );
}