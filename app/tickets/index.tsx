import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, QrCode, MoveVertical as MoreVertical, Filter } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

interface Ticket {
  id: string;
  bookingId: string;
  route: {
    from: string;
    to: string;
  };
  date: string;
  time: string;
  duration: string;
  operator: string;
  routeNumber: string;
  seatNumber: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  busImage: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    bookingId: 'SB2024011501',
    route: { from: 'Colombo Fort', to: 'Kandy' },
    date: 'Today, Jan 15',
    time: '08:30 AM',
    duration: '2h 30m',
    operator: 'SLTB Express',
    routeNumber: '001',
    seatNumber: 'A12',
    price: 250,
    status: 'upcoming',
    busImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    bookingId: 'SB2024011401',
    route: { from: 'Galle', to: 'Matara' },
    date: 'Yesterday, Jan 14',
    time: '02:30 PM',
    duration: '45m',
    operator: 'Lanka Travels',
    routeNumber: '138',
    seatNumber: 'B05',
    price: 120,
    status: 'completed',
    busImage: 'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    bookingId: 'SB2024011301',
    route: { from: 'Negombo', to: 'Colombo' },
    date: 'Jan 13, 2024',
    time: '06:00 PM',
    duration: '1h 15m',
    operator: 'Comfort Line',
    routeNumber: '205',
    seatNumber: 'C08',
    price: 180,
    status: 'cancelled',
    busImage: 'https://images.pexels.com/photos/1098364/pexels-photo-1098364.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function TicketsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Tickets' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filteredTickets = selectedFilter === 'all' 
    ? mockTickets 
    : mockTickets.filter(ticket => ticket.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#004CFF';
      case 'completed': return '#1DD724';
      case 'cancelled': return '#FF3831';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
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
        <Text style={styles.headerTitle}>My Tickets</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && styles.filterTabActive
              ]}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.id && styles.filterTabTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tickets List */}
      <ScrollView style={styles.ticketsContainer}>
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No tickets found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedFilter === 'all' 
                ? "You haven't booked any tickets yet"
                : `No ${selectedFilter} tickets found`
              }
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/search')}
              style={styles.bookNowButton}
            >
              <Text style={styles.bookNowButtonText}>Book Your First Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              onPress={() => router.push(`/tickets/${ticket.id}/detail`)}
              style={styles.ticketCard}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketHeaderLeft}>
                  <Image source={{ uri: ticket.busImage }} style={styles.busImage} />
                  <View style={styles.ticketInfo}>
                    <Text style={styles.operatorName}>{ticket.operator}</Text>
                    <Text style={styles.routeNumber}>Route {ticket.routeNumber}</Text>
                  </View>
                </View>
                <View style={styles.ticketHeaderRight}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(ticket.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                      {getStatusText(ticket.status)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreVertical size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: '#004CFF' }]} />
                  <Text style={styles.routeLocation}>{ticket.route.from}</Text>
                </View>
                <View style={styles.routeLine}>
                  <View style={styles.line} />
                  <Text style={styles.duration}>{ticket.duration}</Text>
                  <View style={styles.line} />
                </View>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: '#FF3831' }]} />
                  <Text style={styles.routeLocation}>{ticket.route.to}</Text>
                </View>
              </View>

              <View style={styles.ticketDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{ticket.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{ticket.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Seat {ticket.seatNumber}</Text>
                </View>
              </View>

              <View style={styles.ticketFooter}>
                <Text style={styles.bookingId}>#{ticket.bookingId}</Text>
                <View style={styles.ticketFooterRight}>
                  <Text style={styles.price}>LKR {ticket.price}</Text>
                  {ticket.status === 'upcoming' && (
                    <TouchableOpacity
                      onPress={() => router.push(`/tickets/${ticket.id}/qr`)}
                      style={styles.qrButton}
                    >
                      <QrCode size={16} color="#004CFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
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
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#004CFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  ticketsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    // paddingBottom: 120,
    // marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookNowButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  busImage: {
    width: 50,
    height: 35,
    borderRadius: 8,
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  operatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  routeNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  ticketHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routePoint: {
    alignItems: 'center',
    flex: 1,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  routeLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
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
    fontSize: 12,
    color: '#9CA3AF',
  },
  ticketFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  qrButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});