import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ticket, ArrowRight } from 'lucide-react-native';

export default function Onboarding3Screen() {
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
          <View className="w-32 h-32 bg-alert/10 rounded-full items-center justify-center mb-12">
            <Ticket size={64} color="#FF3831" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-6">
            Book Tickets
          </Text>
          <Text className="text-lg text-gray-600 text-center leading-relaxed px-4">
            Reserve your seats and manage your tickets digitally with QR codes
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-2">
            <View className="w-3 h-3 bg-gray-300 rounded-full" />
            <View className="w-3 h-3 bg-gray-300 rounded-full" />
            <View className="w-3 h-3 bg-primary rounded-full" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="bg-primary px-8 py-4 rounded-xl"
          >
            <Text className="text-white text-lg font-semibold">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}