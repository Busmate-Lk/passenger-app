import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Users, Wifi, Snowflake, Zap, Star } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

interface RouteResult {
  id: string;
  routeNumber: string;
  operatorName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
  busImage: string;
}

const mockResults: RouteResult[] = [
  {
    id: '1',
    routeNumber: '001',
    operatorName: 'SLTB Express',
    departureTime: '08:30',
    arrivalTime: '11:00',
    duration: '2h 30m',
    price: 250,
    availableSeats: 23,
    rating: 4.5,
    amenities: ['ac', 'wifi', 'charging'],
    busImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    routeNumber: '138',
    operatorName: 'Lanka Travels',
    departureTime: '09:15',
    arrivalTime: '11:45',
    duration: '2h 30m',
    price: 280,
    availableSeats: 15,
    rating: 4.2,
    amenities: ['ac', 'charging'],
    busImage: 'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    routeNumber: '205',
    operatorName: 'Comfort Line',
    departureTime: '10:00',
    arrivalTime: '12:30',
    duration: '2h 30m',
    price: 320,
    availableSeats: 8,
    rating: 4.8,
    amenities: ['ac', 'wifi', 'charging'],
    busImage: 'https://images.pexels.com/photos/1098364/pexels-photo-1098364.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function SearchResultsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'ac': return <Snowflake size={16} color="#004CFF" />;
      case 'wifi': return <Wifi size={16} color="#004CFF" />;
      case 'charging': return <Zap size={16} color="#004CFF" />;
      default: return null;
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'cheapest', label: 'Cheapest' },
    { id: 'fastest', label: 'Fastest' },
    { id: 'highest-rated', label: 'Highest Rated' }
  ];

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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Colombo Fort → Kandy</Text>
          <Text style={styles.headerSubtitle}>Today • 3 passengers</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>{mockResults.length} buses found</Text>
        
        {mockResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            onPress={() => router.push('/search/schedule')}
            style={styles.resultCard}
          >
            <View style={styles.cardHeader}>
              <Image source={{ uri: result.busImage }} style={styles.busImage} />
              <View style={styles.cardHeaderInfo}>
                <View style={styles.operatorRow}>
                  <Text style={styles.operatorName}>{result.operatorName}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.rating}>{result.rating}</Text>
                  </View>
                </View>
                <Text style={styles.routeNumber}>Route {result.routeNumber}</Text>
              </View>
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timePoint}>
                <Text style={styles.time}>{result.departureTime}</Text>
                <Text style={styles.location}>Colombo Fort</Text>
              </View>
              
              <View style={styles.journeyLine}>
                <View style={styles.dot} />
                <View style={styles.line} />
                <Text style={styles.duration}>{result.duration}</Text>
                <View style={styles.line} />
                <View style={styles.dot} />
              </View>
              
              <View style={styles.timePoint}>
                <Text style={styles.time}>{result.arrivalTime}</Text>
                <Text style={styles.location}>Kandy</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.amenitiesContainer}>
                {result.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityIcon}>
                    {getAmenityIcon(amenity)}
                  </View>
                ))}
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.availableSeats}>{result.availableSeats} seats left</Text>
                <Text style={styles.price}>LKR {result.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#004CFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginVertical: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  busImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  operatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  routeNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timePoint: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  journeyLine: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#004CFF',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  availableSeats: {
    fontSize: 12,
    color: '#1DD724',
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004CFF',
    marginTop: 2,
  },
});