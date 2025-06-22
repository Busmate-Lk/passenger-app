import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  ArrowUpDown,
  Clock,
  Heart,
  ChevronRight,
  Search
} from 'lucide-react-native';
import AppHeader from '@/components/ui/AppHeader';

export default function FavoritesScreen() {
  const router = useRouter();

  // Mock favorite routes data
  const favoriteRoutes = [
    {
      id: '1',
      from: 'Colombo Fort',
      to: 'Kandy',
      frequentTime: 'Weekdays, Morning',
      lastUsed: '2 days ago',
    },
    {
      id: '2',
      from: 'Colombo Fort',
      to: 'Galle',
      frequentTime: 'Weekends',
      lastUsed: '1 week ago',
    },
    {
      id: '3',
      from: 'Nugegoda',
      to: 'Colombo Fort',
      frequentTime: 'Weekdays, Evening',
      lastUsed: 'Yesterday',
    },
    {
      id: '4',
      from: 'Kandy',
      to: 'Colombo Fort',
      frequentTime: 'Monthly',
      lastUsed: '3 weeks ago',
    },
    {
      id: '5',
      from: 'Gampaha',
      to: 'Colombo Fort',
      frequentTime: 'Weekdays',
      lastUsed: '5 days ago',
    }
  ];

  const navigateToSearch = (from, to) => {
    // Navigate to search screen with pre-filled values
    router.push({
      pathname: '/search',
      params: { from, to }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Favorite Routes" />

      <ScrollView style={styles.content}>
        {favoriteRoutes.length > 0 ? (
          <>
            {/* Favorites count */}
            <Text style={styles.countText}>
              {favoriteRoutes.length} saved route{favoriteRoutes.length !== 1 ? 's' : ''}
            </Text>
            
            {/* Favorite routes list */}
            <View style={styles.routesContainer}>
              {favoriteRoutes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={styles.routeCard}
                  onPress={() => navigateToSearch(route.from, route.to)}
                >
                  <View style={styles.routeInfo}>
                    <View style={styles.routePoints}>
                      <View style={styles.pointRow}>
                        <View style={styles.originDot} />
                        <Text style={styles.locationText}>{route.from}</Text>
                      </View>
                      
                      <View style={styles.routeLine} />
                      
                      <View style={styles.pointRow}>
                        <View style={styles.destinationDot} />
                        <Text style={styles.locationText}>{route.to}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.routeDetails}>
                      <View style={styles.detailRow}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.detailText}>{route.frequentTime}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.lastUsedText}>Last used {route.lastUsed}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.routeActions}>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Heart size={18} color="#FF3831" fill="#FF3831" />
                    </TouchableOpacity>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color="#E5E7EB" />
            <Text style={styles.emptyStateTitle}>No Favorite Routes Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Save your frequently used routes for quick access
            </Text>
            <TouchableOpacity 
              style={styles.findRoutesButton}
              onPress={() => router.push('/search')}
            >
              <Search size={18} color="#FFFFFF" />
              <Text style={styles.findRoutesText}>Find Routes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    padding: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 8,
  },
  routesContainer: {
    marginBottom: 24,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routePoints: {
    marginBottom: 12,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
  },
  routeDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  lastUsedText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  routeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  findRoutesButton: {
    flexDirection: 'row',
    backgroundColor: '#004CFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  findRoutesText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});