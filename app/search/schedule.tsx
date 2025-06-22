import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Users, Wifi, Snowflake, Zap, Star, Phone, MessageCircle } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

const scheduleData = {
  operator: 'SLTB Express',
  routeNumber: '001',
  rating: 4.5,
  reviews: 128,
  busImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
  driver: {
    name: 'Mahinda Silva',
    rating: 4.8,
    experience: '8 years',
    phone: '+94771234567'
  },
  schedule: [
    { time: '08:30', location: 'Colombo Fort', status: 'departure', delay: 0 },
    { time: '09:15', location: 'Kadawatha', status: 'stop', delay: 0 },
    { time: '09:45', location: 'Kiribathgoda', status: 'stop', delay: 0 },
    { time: '10:30', location: 'Nittambuwa', status: 'stop', delay: 0 },
    { time: '11:00', location: 'Kandy', status: 'arrival', delay: 0 }
  ],
  amenities: [
    { name: 'Air Conditioning', icon: 'ac', available: true },
    { name: 'WiFi', icon: 'wifi', available: false },
    { name: 'USB Charging', icon: 'charging', available: true },
    { name: 'Reclining Seats', icon: 'seats', available: true }
  ],
  price: 250,
  availableSeats: 23,
  totalSeats: 50
};

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('schedule');

  const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case 'ac': return <Snowflake size={20} color="#004CFF" />;
      case 'wifi': return <Wifi size={20} color="#6B7280" />;
      case 'charging': return <Zap size={20} color="#004CFF" />;
      default: return <Users size={20} color="#004CFF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'departure': return '#004CFF';
      case 'arrival': return '#FF3831';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Bus Info Card */}
        <View style={styles.busInfoCard}>
          <View style={styles.busHeader}>
            <Image source={{ uri: scheduleData.busImage }} style={styles.busImage} />
            <View style={styles.busDetails}>
              <Text style={styles.operatorName}>{scheduleData.operator}</Text>
              <Text style={styles.routeNumber}>Route {scheduleData.routeNumber}</Text>
              <View style={styles.ratingRow}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>{scheduleData.rating}</Text>
                <Text style={styles.reviews}>({scheduleData.reviews} reviews)</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>LKR {scheduleData.price}</Text>
              <Text style={styles.availableSeats}>{scheduleData.availableSeats}/{scheduleData.totalSeats} seats</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('schedule')}
            style={[styles.tab, selectedTab === 'schedule' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'schedule' && styles.activeTabText]}>
              Schedule
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('amenities')}
            style={[styles.tab, selectedTab === 'amenities' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'amenities' && styles.activeTabText]}>
              Amenities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('driver')}
            style={[styles.tab, selectedTab === 'driver' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'driver' && styles.activeTabText]}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'schedule' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.sectionTitle}>Route Schedule</Text>
            {scheduleData.schedule.map((stop, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.scheduleTime}>{stop.time}</Text>
                  {stop.delay > 0 && (
                    <Text style={styles.delay}>+{stop.delay}min</Text>
                  )}
                </View>
                <View style={styles.stopIndicator}>
                  <View style={[styles.stopDot, { backgroundColor: getStatusColor(stop.status) }]} />
                  {index < scheduleData.schedule.length - 1 && <View style={styles.stopLine} />}
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopLocation}>{stop.location}</Text>
                  <Text style={styles.stopStatus}>
                    {stop.status === 'departure' ? 'Departure' : 
                     stop.status === 'arrival' ? 'Arrival' : 'Stop'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'amenities' && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Bus Amenities</Text>
            <View style={styles.amenitiesList}>
              {scheduleData.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={[
                    styles.amenityIconContainer,
                    { backgroundColor: amenity.available ? '#EBF2FF' : '#F3F4F6' }
                  ]}>
                    {getAmenityIcon(amenity.icon)}
                  </View>
                  <Text style={[
                    styles.amenityName,
                    { color: amenity.available ? '#111827' : '#9CA3AF' }
                  ]}>
                    {amenity.name}
                  </Text>
                  <Text style={styles.amenityStatus}>
                    {amenity.available ? 'Available' : 'Not Available'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'driver' && (
          <View style={styles.driverContainer}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitial}>M</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{scheduleData.driver.name}</Text>
                <View style={styles.driverRating}>
                  <Star size={14} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.driverRatingText}>{scheduleData.driver.rating}</Text>
                  <Text style={styles.driverExperience}>• {scheduleData.driver.experience}</Text>
                </View>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <Phone size={18} color="#004CFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <MessageCircle size={18} color="#004CFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity
          onPress={() => router.push('/search/booking')}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Book This Bus</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#004CFF',
    borderBottomWidth: 1,
    borderBottomColor: '#003CC7',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  busInfoCard: {
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  busDetails: {
    flex: 1,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  routeNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004CFF',
  },
  availableSeats: {
    fontSize: 12,
    color: '#1DD724',
    fontWeight: '500',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#004CFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  scheduleContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeContainer: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  delay: {
    fontSize: 12,
    color: '#FF3831',
    marginTop: 2,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stopLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  stopInfo: {
    flex: 1,
    paddingTop: 2,
  },
  stopLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  stopStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  amenitiesContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  amenitiesList: {
    gap: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  amenityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  amenityStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  driverContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  driverInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  driverRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  driverExperience: {
    fontSize: 14,
    color: '#6B7280',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bookButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});