import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle, Chrome as Home, Ticket } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <CheckCircle size={80} color="#1DD724" />
        </View>
        
        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.subtitle}>
          Your bus ticket has been confirmed and saved to your account
        </Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            You will receive a confirmation SMS and email shortly
          </Text>
          <Text style={styles.detailsText}>
            Your ticket is now available in "My Tickets"
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => router.push('/tickets')}
            style={styles.ticketsButton}
          >
            <Ticket size={20} color="white" />
            <Text style={styles.ticketsButtonText}>View My Tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            style={styles.homeButton}
          >
            <Home size={20} color="#004CFF" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.autoRedirectText}>
          Automatically redirecting to home in 5 seconds...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  ticketsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ticketsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  autoRedirectText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});