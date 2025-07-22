import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, QrCode, Download, Share, Calendar, Clock, MapPin, User, Phone, MessageCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { MockUserService } from '@/services/mockUserService';

export default function TicketDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState('details');
  const { user } = useAuth();

  // Get ticket data from mock service
  const ticketData = user?.email ? MockUserService.getTicketById(user.email, id as string) : null;

  // Fallback to mock data if ticket not found
  const fallbackTicketData = {
    id: id as string,
    bookingId: 'SB2024011501',
    route: { from: 'Colombo Fort', to: 'Kandy' },
    date: 'Today, Jan 15, 2024',
    time: '08:30 AM',
    arrivalTime: '11:00 AM',
    duration: '2h 30m',
    operator: 'SLTB Express',
    routeNumber: '001',
    seatNumber: 'A12',
    price: 250,
    status: 'upcoming',
    busImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    passenger: {
      name: user?.name || 'John Doe',
      phone: user?.phone || '+94771234567',
      email: user?.email || 'john@example.com'
    },
    driver: {
      name: 'Mahinda Silva',
      phone: '+94771234567',
      rating: 4.8
    },
    qrCode: 'QR123456789',
    cancellationPolicy: 'Free cancellation up to 2 hours before departure'
  };

  const ticket = ticketData || fallbackTicketData;

  const handleCancelTicket = () => {
    Alert.alert(
      'Cancel Ticket',
      'Are you sure you want to cancel this ticket? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => router.push('/tickets/cancel')
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#004CFF';
      case 'completed': return '#1DD724';
      case 'cancelled': return '#FF3831';
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
        <Text style={styles.headerTitle}>Ticket Details</Text>
        <TouchableOpacity
          onPress={() => router.push(`/tickets/${id}/qr`)}
          style={styles.qrButton}
        >
          <QrCode size={20} color="#004CFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketHeaderLeft}>
              <Image source={{ uri: ticket.busImage }} style={styles.busImage} />
              <View style={styles.ticketInfo}>
                <Text style={styles.operatorName}>{ticket.operator}</Text>
                <Text style={styles.routeNumber}>Route {ticket.routeNumber}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(ticket.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#004CFF' }]} />
              <Text style={styles.routeLocation}>{ticket.route.from}</Text>
              <Text style={styles.routeTime}>{ticket.time}</Text>
            </View>
            <View style={styles.routeLine}>
              <View style={styles.line} />
              <Text style={styles.duration}>{ticket.duration}</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#FF3831' }]} />
              <Text style={styles.routeLocation}>{ticket.route.to}</Text>
              <Text style={styles.routeTime}>{ticket.arrivalTime}</Text>
            </View>
          </View>

          <View style={styles.ticketFooter}>
            <Text style={styles.bookingId}>#{ticket.bookingId}</Text>
            <Text style={styles.price}>LKR {ticket.price}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('details')}
            style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('passenger')}
            style={[styles.tab, selectedTab === 'passenger' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'passenger' && styles.activeTabText]}>
              Passenger
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
        {selectedTab === 'details' && (
          <View style={styles.tabContent}>
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Journey Details</Text>
              <View style={styles.detailItem}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{ticket.date}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Clock size={20} color="#6B7280" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Departure Time</Text>
                  <Text style={styles.detailValue}>{ticket.time}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={20} color="#6B7280" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Seat Number</Text>
                  <Text style={styles.detailValue}>{ticket.seatNumber}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Important Information</Text>
              <View style={styles.infoCard}>
                <AlertTriangle size={16} color="#F59E0B" />
                <Text style={styles.infoText}>
                  Please arrive at the departure point 15 minutes before scheduled time
                </Text>
              </View>
              <Text style={styles.policyText}>{ticket.cancellationPolicy}</Text>
            </View>
          </View>
        )}

        {selectedTab === 'passenger' && (
          <View style={styles.tabContent}>
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Passenger Information</Text>
              <View style={styles.passengerCard}>
                <View style={styles.passengerAvatar}>
                  <User size={24} color="#004CFF" />
                </View>
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>{ticket.passenger.name}</Text>
                  <Text style={styles.passengerDetail}>{ticket.passenger.phone}</Text>
                  <Text style={styles.passengerDetail}>{ticket.passenger.email}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'driver' && (
          <View style={styles.tabContent}>
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Driver Information</Text>
              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitial}>M</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{ticket.driver.name}</Text>
                  <Text style={styles.driverRating}>Rating: {ticket.driver.rating} ⭐</Text>
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
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#004CFF" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#004CFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        {ticket.status === 'upcoming' && (
          <TouchableOpacity
            onPress={handleCancelTicket}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel Ticket</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF2FF',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  busImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  ticketInfo: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  routePoint: {
    alignItems: 'center',
    flex: 1,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  routeLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  routeLine: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookingId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004CFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
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
  tabContent: {
    marginBottom: 24,
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailInfo: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
  },
  policyText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  passengerDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
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
    marginBottom: 4,
  },
  driverRating: {
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
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
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#004CFF',
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});