import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  StatusBar,
  Platform
} from 'react-native';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Bell, 
  AlertTriangle, 
  Clock, 
  Bus, 
  Ticket, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { MockUserService } from '@/services/mockUserService';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  // Get user-specific data from mock service
  const upcomingTrip = user?.email ? MockUserService.getUpcomingTrip(user.email) : null;
  const recentRoutes = user?.email ? MockUserService.getRecentRoutes(user.email) : [];
  
  // Mock data for dashboard
  const promotions = [
    { 
      id: 'promo1', 
      title: 'Weekend Special', 
      description: 'Get 15% off on weekend trips!',
      color: '#004CFF',
      image: 'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
      id: 'promo2', 
      title: 'Student Discount', 
      description: 'Special rates for students with ID',
      color: '#FF3831',
      image: 'https://images.pexels.com/photos/1872199/pexels-photo-1872199.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];
  
  // Alert data
  const alerts = [
    { 
      id: 'alert1',
      title: 'Route 001 Delays',
      message: 'Temporary delays on Colombo-Kandy due to construction',
      time: '10 mins ago',
      type: 'warning'
    }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#1DD724';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#FF3831';
      default: return '#6B7280';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{user?.name ?? 'Passenger'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications/inbox')}
        >
          <Bell size={24} color="#004CFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#6B7280" />
            <Text style={styles.searchPlaceholder}>Where are you going?</Text>
          </TouchableOpacity>
        </View>
        
        {/* Upcoming Trip Card */}
        {upcomingTrip && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Trip</Text>
              <TouchableOpacity onPress={() => router.push('/tickets')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.upcomingTripCard}
              onPress={() => router.push(`/tickets/${upcomingTrip.id}/detail`)}
            >
              <Image source={{ uri: upcomingTrip.busImage }} style={styles.tripImage} />
              <View style={styles.tripOverlay}>
                <View style={styles.tripDetails}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripRoute}>{upcomingTrip.route.from} → {upcomingTrip.route.to}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(upcomingTrip.status)}15` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(upcomingTrip.status) }]}>
                        Upcoming
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tripInfo}>{upcomingTrip.operator} • Route {upcomingTrip.routeNumber}</Text>
                  <View style={styles.tripFooter}>
                    <View style={styles.tripDetail}>
                      <Clock size={16} color="#FFFFFF" />
                      <Text style={styles.tripDetailText}>{upcomingTrip.date}, {upcomingTrip.time}</Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <Ticket size={16} color="#FFFFFF" />
                      <Text style={styles.tripDetailText}>Seat {upcomingTrip.seatNumber}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/search')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EBF2FF' }]}>
              <Search size={24} color="#004CFF" />
            </View>
            <Text style={styles.quickActionText}>Find Routes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/tickets')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF4EB' }]}>
              <Ticket size={24} color="#FF8A00" />
            </View>
            <Text style={styles.quickActionText}>My Tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/tracking/input')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EBFFF4' }]}>
              <Bus size={24} color="#1DD724" />
            </View>
            <Text style={styles.quickActionText}>Track Bus</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/wallet')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0EEFF' }]}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10613/10613983.png' }} 
                style={{ width: 24, height: 24 }} 
              />
            </View>
            <Text style={styles.quickActionText}>Wallet</Text>
          </TouchableOpacity>
        </View>
        
        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {alerts.map(alert => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertIconContainer}>
                  <AlertTriangle size={24} color="#FF8A00" />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Recent Routes */}
        {recentRoutes.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Routes</Text>
              <TouchableOpacity onPress={() => router.push('/profile/favorites')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentRoutesContainer}>
              {recentRoutes.map(route => (
                <TouchableOpacity 
                  key={route.id} 
                  style={styles.recentRouteItem}
                  onPress={() => router.push('/search/results')}
                >
                  <View style={styles.routePoints}>
                    <View style={styles.routePointContainer}>
                      <View style={[styles.routePointDot, { backgroundColor: '#004CFF' }]} />
                      <Text style={styles.routePointText}>{route.from}</Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routePointContainer}>
                      <View style={[styles.routePointDot, { backgroundColor: '#FF3831' }]} />
                      <Text style={styles.routePointText}>{route.to}</Text>
                    </View>
                  </View>
                  <View style={styles.routeActions}>
                    <TouchableOpacity style={styles.routeActionIcon}>
                      <Star size={18} color={route.saved ? "#FFB800" : "#9CA3AF"} fill={route.saved ? "#FFB800" : "none"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.routeActionSearch}>
                      <Text style={styles.routeActionSearchText}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Promotions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoScrollContainer}
          >
            {promotions.map(promo => (
              <TouchableOpacity key={promo.id} style={styles.promoCard}>
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <View style={[styles.promoOverlay, { backgroundColor: `${promo.color}99` }]}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDescription}>{promo.description}</Text>
                  <View style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Learn More</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Popular Routes */}
        <View style={[styles.sectionContainer, { marginBottom: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
          </View>
          
          <View style={styles.popularRoutesContainer}>
            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Colombo - Kandy</Text>
                <Text style={styles.popularRouteSubtitle}>3 hours • Express</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 250</Text>
                <ArrowUp size={16} color="#FF3831" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Colombo - Galle</Text>
                <Text style={styles.popularRouteSubtitle}>2 hours • Highway</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 200</Text>
                <ArrowDown size={16} color="#1DD724" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Kandy - Nuwara Eliya</Text>
                <Text style={styles.popularRouteSubtitle}>2.5 hours • Scenic</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 220</Text>
                <ArrowDown size={16} color="#1DD724" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#004CFF',
  },
  greeting: {
    fontSize: 14,
    color: '#FFFFF0',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3831',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: 'background',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '500',
  },
  upcomingTripCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  tripDetails: {
    gap: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tripFooter: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: 'white',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginTop: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertsContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentRoutesContainer: {
    gap: 12,
  },
  recentRouteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routePoints: {
    flex: 1,
  },
  routePointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routePointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routePointText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  routeLine: {
    height: 20,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginVertical: 4,
  },
  routeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeActionSearch: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeActionSearchText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  promoScrollContainer: {
    paddingRight: 24,
  },
  promoCard: {
    width: Dimensions.get('window').width * 0.75,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  promoDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  popularRoutesContainer: {
    gap: 12,
  },
  popularRouteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  popularRouteInfo: {
    flex: 1,
  },
  popularRouteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  popularRouteSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  popularRoutePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popularRoutePriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});