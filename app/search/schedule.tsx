import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MapPin, Clock, Users, Wifi, Snowflake, Zap, Star, Phone, MessageCircle } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import mockData from '../../data/mockBusRouteData.json';
import AppHeader from '../../components/ui/AppHeader';

interface ScheduleData {
  id: string;
  operator: string;
  routeNumber: string;
  busName: string;
  fullRoute: string;
  searchJourney: {
    from: string;
    to: string;
  };
  rating: number;
  reviews: number;
  busImage: string;
  driver: {
    name: string;
    rating: number;
    experience: string;
    phone: string;
  };
  conductor: {
    name: string;
    rating: number;
    experience: string;
    phone: string;
  };
  schedule: Array<{
    time: string;
    location: string;
    status: string;
    delay: number;
    isInUserJourney: boolean;
  }>;
  amenityDetails: Array<{
    name: string;
    icon: string;
    available: boolean;
  }>;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState('schedule');
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  // Parse parameters
  const routeId = params.routeId as string;
  const from = params.from as string || 'Colombo Fort';
  const to = params.to as string || 'Kandy';
  const passengers = parseInt(params.passengers as string) || 1;

  useEffect(() => {
    // Find the route by ID in mock data
    const foundRoute = mockData.routes.find(route => route.id === routeId);
    
    if (foundRoute) {
      // Transform the data to match the schedule screen format
      const transformedData: ScheduleData = {
        id: foundRoute.id,
        operator: foundRoute.operatorName,
        routeNumber: foundRoute.routeNumber,
        busName: foundRoute.busName,
        fullRoute: foundRoute.fullRoute,
        searchJourney: {
          from: from,
          to: to
        },
        rating: foundRoute.rating,
        reviews: foundRoute.reviews,
        busImage: foundRoute.busImage,
        driver: foundRoute.driver,
        conductor: foundRoute.conductor,
        schedule: foundRoute.schedule.map(stop => ({
          ...stop,
          // Update isInUserJourney based on actual user journey
          isInUserJourney: isStopInUserJourney(stop.location, from, to, foundRoute.schedule)
        })),
        amenityDetails: foundRoute.amenityDetails,
        price: foundRoute.price,
        availableSeats: foundRoute.availableSeats,
        totalSeats: foundRoute.totalSeats
      };
      
      setScheduleData(transformedData);
    }
  }, [routeId, from, to]);

  // Helper function to determine if a stop is in the user's journey
  const isStopInUserJourney = (stopLocation: string, userFrom: string, userTo: string, schedule: any[]) => {
    const fromIndex = schedule.findIndex(stop => 
      stop.location.toLowerCase().includes(userFrom.toLowerCase())
    );
    const toIndex = schedule.findIndex(stop => 
      stop.location.toLowerCase().includes(userTo.toLowerCase())
    );
    const stopIndex = schedule.findIndex(stop => stop.location === stopLocation);
    
    // If we can't find the stops, include all stops as a fallback
    if (fromIndex === -1 || toIndex === -1) return true;
    
    return stopIndex >= fromIndex && stopIndex <= toIndex;
  };

  const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case 'ac': return <Snowflake size={20} color="#004CFF" />;
      case 'wifi': return <Wifi size={20} color={scheduleData?.amenityDetails.find(a => a.icon === 'wifi')?.available ? "#004CFF" : "#6B7280"} />;
      case 'charging': return <Zap size={20} color="#004CFF" />;
      case 'seats': return <Users size={20} color="#004CFF" />;
      default: return <Users size={20} color="#004CFF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'departure': 
      case 'origin': return '#004CFF';
      case 'arrival': 
      case 'destination': return '#FF3831';
      default: return '#6B7280';
    }
  };

  const calculateDuration = () => {
    if (!scheduleData || !scheduleData.schedule.length) return '0h 00m';
    
    const userJourneyStops = scheduleData.schedule.filter(stop => stop.isInUserJourney);
    if (userJourneyStops.length < 2) return '0h 00m';
    
    const startTime = userJourneyStops[0].time;
    const endTime = userJourneyStops[userJourneyStops.length - 1].time;
    
    // Calculate duration between start and end times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  // Show loading or error state if data is not found
  if (!scheduleData) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Schedule Details" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading schedule details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userJourneyStops = scheduleData.schedule.filter(stop => stop.isInUserJourney);
  const departureTime = userJourneyStops.length > 0 ? userJourneyStops[0].time : '00:00';
  const arrivalTime = userJourneyStops.length > 0 ? userJourneyStops[userJourneyStops.length - 1].time : '00:00';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader title="Schedule Details" />

      <ScrollView style={styles.content}>
        {/* Bus Info Card */}
        <View style={styles.busInfoCard}>
          <View style={styles.busHeader}>
            <Image source={{ uri: scheduleData.busImage }} style={styles.busImage} />
            <View style={styles.busDetails}>
              <Text style={styles.busName}>{scheduleData.busName}</Text>
              <Text style={styles.operatorName}>{scheduleData.operator}</Text>
              
              <View style={styles.journeyInfo}>
                <Text style={styles.journeyText}>
                  {scheduleData.searchJourney.from} to {scheduleData.searchJourney.to}
                </Text>
              </View>
              
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFB800" fill="#FFB800" />
                <Text style={styles.ratingText}>{scheduleData.rating}</Text>
                <Text style={styles.reviewsText}>({scheduleData.reviews} reviews)</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItemRoute}>
              <Text style={styles.infoLabel}>Full Route</Text>
              <Text style={styles.infoValue}>{scheduleData.fullRoute}</Text>
            </View>
            <View style={styles.infoItemSeats}>
              <Text style={styles.infoLabel}>Seats Available</Text>
              <Text style={styles.availableSeats}>{scheduleData.availableSeats}/{scheduleData.totalSeats}</Text>
            </View>
            <View style={styles.infoItemPrice}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.priceText}>LKR {scheduleData.price}</Text>
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
            onPress={() => setSelectedTab('staff')}
            style={[styles.tab, selectedTab === 'staff' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'staff' && styles.activeTabText]}>
              Staff
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'schedule' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.sectionTitle}>Route Schedule</Text>
            
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleHeaderItem}>
                <Text style={styles.scheduleHeaderTitle}>Departure</Text>
                <Text style={styles.scheduleHeaderValue}>{departureTime}</Text>
              </View>
              <View style={styles.scheduleHeaderItem}>
                <Text style={styles.scheduleHeaderTitle}>Arrival</Text>
                <Text style={styles.scheduleHeaderValue}>{arrivalTime}</Text>
              </View>
              <View style={styles.scheduleHeaderItem}>
                <Text style={styles.scheduleHeaderTitle}>Duration</Text>
                <Text style={styles.scheduleHeaderValue}>{calculateDuration()}</Text>
              </View>
            </View>
            
            <View style={styles.journeySegmentInfo}>
              <Text style={styles.journeySegmentTitle}>Your Journey ({passengers} passenger{passengers !== 1 ? 's' : ''})</Text>
              <Text style={styles.journeySegmentDetails}>{scheduleData.searchJourney.from} → {scheduleData.searchJourney.to}</Text>
            </View>
            
            {scheduleData.schedule.map((stop, index) => (
              <View key={index} style={[
                styles.scheduleItem,
                stop.isInUserJourney && styles.scheduleItemInJourney
              ]}>
                <View style={styles.timeContainer}>
                  <Text style={[
                    styles.scheduleTime,
                    (stop.location === scheduleData.searchJourney.from || 
                     stop.location === scheduleData.searchJourney.to) && 
                    styles.highlightedText
                  ]}>
                    {stop.time}
                  </Text>
                  {stop.delay > 0 && (
                    <Text style={styles.delay}>+{stop.delay}min</Text>
                  )}
                </View>
                <View style={styles.stopIndicator}>
                  <View style={[
                    styles.stopDot, 
                    { backgroundColor: getStatusColor(stop.status) },
                    (stop.location === scheduleData.searchJourney.from || 
                     stop.location === scheduleData.searchJourney.to) && 
                    styles.highlightedDot
                  ]} />
                  {index < scheduleData.schedule.length - 1 && (
                    <View style={[
                      styles.stopLine,
                      !scheduleData.schedule[index+1].isInUserJourney && 
                      !stop.isInUserJourney && styles.fadedLine
                    ]} />
                  )}
                </View>
                <View style={styles.stopInfo}>
                  <Text style={[
                    styles.stopLocation,
                    (stop.location === scheduleData.searchJourney.from || 
                     stop.location === scheduleData.searchJourney.to) && 
                    styles.highlightedText
                  ]}>
                    {stop.location}
                  </Text>
                  <Text style={styles.stopStatus}>
                    {stop.status === 'origin' ? 'Origin' :
                     stop.status === 'destination' ? 'Destination' :
                     stop.status === 'departure' ? 'Departure' : 
                     stop.status === 'arrival' ? 'Arrival' : 'Stop'}
                    {(stop.location === scheduleData.searchJourney.from) && ' • Your Pickup'}
                    {(stop.location === scheduleData.searchJourney.to) && ' • Your Dropoff'}
                  </Text>
                </View>
              </View>
            ))}
            
            <View style={styles.scheduleNotes}>
              <Text style={styles.scheduleNotesText}>
                Note: Schedule times may vary based on traffic conditions.
              </Text>
            </View>
          </View>
        )}

        {selectedTab === 'amenities' && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Bus Amenities</Text>
            <View style={styles.amenitiesList}>
              {scheduleData.amenityDetails.map((amenity, index) => (
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
                  <Text style={[
                    styles.amenityStatus,
                    { color: amenity.available ? '#1DD724' : '#FF3831' }
                  ]}>
                    {amenity.available ? 'Available' : 'Not Available'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'staff' && (
          <View style={styles.staffContainer}>
            <Text style={styles.sectionTitle}>Bus Staff</Text>
            
            <Text style={styles.staffTypeLabel}>Driver</Text>
            <View style={styles.staffCard}>
              <View style={styles.staffAvatar}>
                <Text style={styles.staffInitial}>{scheduleData.driver.name.charAt(0)}</Text>
              </View>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{scheduleData.driver.name}</Text>
                <View style={styles.staffRating}>
                  <Star size={14} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.staffRatingText}>{scheduleData.driver.rating}</Text>
                  <Text style={styles.staffExperience}>• {scheduleData.driver.experience}</Text>
                </View>
              </View>
              <View style={styles.staffActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <Phone size={18} color="#004CFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <MessageCircle size={18} color="#004CFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={[styles.staffTypeLabel, {marginTop: 24}]}>Conductor</Text>
            <View style={styles.staffCard}>
              <View style={[styles.staffAvatar, {backgroundColor: '#1DD724'}]}>
                <Text style={styles.staffInitial}>{scheduleData.conductor.name.charAt(0)}</Text>
              </View>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{scheduleData.conductor.name}</Text>
                <View style={styles.staffRating}>
                  <Star size={14} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.staffRatingText}>{scheduleData.conductor.rating}</Text>
                  <Text style={styles.staffExperience}>• {scheduleData.conductor.experience}</Text>
                </View>
              </View>
              <View style={styles.staffActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <Phone size={18} color="#004CFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <MessageCircle size={18} color="#004CFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.staffNotesContainer}>
              <Text style={styles.staffNotes}>
                You can contact the staff for assistance during your journey. Both driver and conductor are experienced professionals committed to your safety and comfort.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingContainer}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingPrice}>LKR {scheduleData.price * passengers}</Text>
          <Text style={styles.bookingDetails}>for {passengers} passenger{passengers !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/search/booking',
            params: {
              routeId: scheduleData.id,
              from: scheduleData.searchJourney.from,
              to: scheduleData.searchJourney.to,
              passengers: passengers.toString(),
              price: (scheduleData.price * passengers).toString(),
              departureTime,
              arrivalTime
            }
          })}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
    marginBottom: 16,
  },
  busImage: {
    width: 100,
    height: 75,
    borderRadius: 12,
    marginRight: 16,
  },
  busDetails: {
    flex: 1,
  },
  busName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  operatorName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  journeyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  journeyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoItemRoute: {
    flex: 2,
  },
  infoItemSeats: {
    flex: 1,
  },
  infoItemPrice: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginTop: 4,
  },
  availableSeats: {
    fontSize: 14,
    color: '#1DD724',
    fontWeight: '600',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '600',
    marginTop: 4,
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
  },
  scheduleHeaderItem: {
    alignItems: 'center',
  },
  scheduleHeaderTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  scheduleHeaderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  journeySegmentInfo: {
    backgroundColor: '#EBF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  journeySegmentTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#004CFF',
    marginBottom: 4,
  },
  journeySegmentDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  scheduleItemInJourney: {
    backgroundColor: '#FAFBFF',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
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
  highlightedText: {
    color: '#004CFF',
    fontWeight: '700',
  },
  highlightedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#E6F2FF',
  },
  fadedLine: {
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
  scheduleNotes: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  scheduleNotesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  amenitiesContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 120,
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
    fontWeight: '500',
  },
  staffContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 120,
  },
  staffTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  staffAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  staffInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  staffRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  staffRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  staffExperience: {
    fontSize: 14,
    color: '#6B7280',
  },
  staffActions: {
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
  staffNotesContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  staffNotes: {
    fontSize: 14,
    color: '#6B7280',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004CFF',
  },
  bookingDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});