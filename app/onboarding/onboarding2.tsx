import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ArrowRight } from 'lucide-react-native';

export default function Onboarding2Screen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <View className="items-end mb-8">
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="px-4 py-2"
          >
            <Text className="text-gray-500 text-base">Skip</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center">
          <View className="w-32 h-32 bg-success/10 rounded-full items-center justify-center mb-12">
            <Text className="text-6xl">🚌</Text>
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-6">
            Track Buses Live
          </Text>
          <Text className="text-lg text-gray-600 text-center leading-relaxed px-4">
            Get real-time location updates and arrival predictions for your buses
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-2">
            <View className="w-3 h-3 bg-gray-300 rounded-full" />
            <View className="w-3 h-3 bg-primary rounded-full" />
            <View className="w-3 h-3 bg-gray-300 rounded-full" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/onboarding/onboarding3')}
            className="bg-primary w-14 h-14 rounded-full items-center justify-center"
          >
            <ArrowRight size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}