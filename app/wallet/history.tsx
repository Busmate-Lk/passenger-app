import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  Filter,
  TriangleAlert as AlertTriangle,
  Check,
  X,
  CreditCard,
  Bus
} from 'lucide-react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'top-up', label: 'Top-ups' },
    { id: 'payment', label: 'Payments' },
    { id: 'card-use', label: 'Card Use' },
  ];

  // Mock transaction history data
  const transactions = [
    {
      id: '1',
      type: 'topup',
      amount: 1000,
      date: 'Today, 10:30 AM',
      status: 'completed',
      method: 'Credit Card',
      reference: 'TXN123456789'
    },
    {
      id: '2',
      type: 'payment',
      amount: 250,
      date: 'Yesterday, 3:15 PM',
      title: 'Bus Ticket - Colombo to Kandy',
      status: 'completed',
      reference: 'BKG987654321'
    },
    {
      id: '3',
      type: 'card-use',
      amount: 50,
      date: 'Jan 22, 2024',
      title: 'Bus Fare - Route 138',
      status: 'completed',
      location: 'Galle Road, Colombo',
      reference: 'CRD456789123'
    },
    {
      id: '4',
      type: 'payment',
      amount: 180,
      date: 'Jan 20, 2024',
      title: 'Bus Ticket - Galle to Matara',
      status: 'completed',
      reference: 'BKG123789456'
    },
    {
      id: '5',
      type: 'topup',
      amount: 500,
      date: 'Jan 18, 2024',
      status: 'failed',
      method: 'Credit Card',
      reference: 'TXN987321654',
      error: 'Payment gateway timeout'
    },
    {
      id: '6',
      type: 'card-use',
      amount: 30,
      date: 'Jan 15, 2024',
      title: 'Bus Fare - Route 101',
      status: 'completed',
      location: 'Kandy City Center',
      reference: 'CRD789456123'
    },
    {
      id: '7',
      type: 'payment',
      amount: 300,
      date: 'Jan 12, 2024',
      title: 'Bus Ticket - Colombo to Jaffna',
      status: 'pending',
      reference: 'BKG456123789'
    },
  ];

  const getFilteredTransactions = () => {
    if (selectedFilter === 'all') return transactions;
    if (selectedFilter === 'top-up') return transactions.filter(t => t.type === 'topup');
    if (selectedFilter === 'payment') return transactions.filter(t => t.type === 'payment');
    if (selectedFilter === 'card-use') return transactions.filter(t => t.type === 'card-use');
    return transactions;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#1DD724';
      case 'pending': return '#F59E0B';
      case 'failed': return '#FF3831';
      default: return '#6B7280';
    }
  };

  const getTransactionIcon = (type, status) => {
    if (status === 'failed') return <AlertTriangle size={16} color="#FF3831" />;
    if (status === 'pending') return <Clock size={16} color="#F59E0B" />;
    
    switch(type) {
      case 'topup': return <Plus size={16} color="#1DD724" />;
      case 'payment': return <Bus size={16} color="#004CFF" />;
      case 'card-use': return <CreditCard size={16} color="#004CFF" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getTransactionPrefix = (type) => {
    return (type === 'topup') ? '+' : '-';
  };

  const getTransactionColor = (type, status) => {
    if (status === 'failed') return '#FF3831';
    if (status === 'pending') return '#F59E0B';
    return type === 'topup' ? '#1DD724' : '#004CFF';
  };

  const getStatusIndicator = (status) => {
    switch(status) {
      case 'completed': return <Check size={14} color="#1DD724" />;
      case 'pending': return <Clock size={14} color="#F59E0B" />;
      case 'failed': return <X size={14} color="#FF3831" />;
      default: return null;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const formatDate = (dateString) => {
    // Group transactions by date
    if (dateString.startsWith('Today')) return 'Today';
    if (dateString.startsWith('Yesterday')) return 'Yesterday';
    return dateString.split(',')[0]; // Extract just the date part
  };

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

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
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.filterIconButton}>
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

      <ScrollView style={styles.content}>
        {Object.keys(groupedTransactions).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No transactions found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedFilter === 'all' 
                ? "You haven't made any transactions yet"
                : `No ${selectedFilter} transactions found`
              }
            </Text>
          </View>
        ) : (
          Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateHeader}>{date}</Text>
              
              {dateTransactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() => {}}
                  style={styles.transactionCard}
                >
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionIconContainer}>
                      {getTransactionIcon(transaction.type, transaction.status)}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>
                        {transaction.title || (
                          transaction.type === 'topup' 
                            ? 'Wallet Top-up' 
                            : transaction.type === 'card-use'
                              ? 'Travel Card Usage'
                              : 'Payment'
                        )}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {transaction.date.includes(',') ? transaction.date.split(', ')[1] : transaction.date}
                      </Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.amountText,
                        { color: getTransactionColor(transaction.type, transaction.status) }
                      ]}>
                        {getTransactionPrefix(transaction.type)}LKR {transaction.amount}
                      </Text>
                      <View style={[
                        styles.statusIndicator, 
                        { backgroundColor: `${getStatusColor(transaction.status)}20` }
                      ]}>
                        <View style={styles.statusIconContainer}>
                          {getStatusIndicator(transaction.status)}
                        </View>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(transaction.status) }
                        ]}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    {transaction.location && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text style={styles.detailValue}>{transaction.location}</Text>
                      </View>
                    )}
                    
                    {transaction.method && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Method</Text>
                        <Text style={styles.detailValue}>{transaction.method}</Text>
                      </View>
                    )}
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reference</Text>
                      <Text style={styles.detailValue}>{transaction.reference}</Text>
                    </View>
                    
                    {transaction.error && (
                      <View style={styles.errorContainer}>
                        <AlertTriangle size={14} color="#FF3831" />
                        <Text style={styles.errorText}>{transaction.error}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  filterIconButton: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIconContainer: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    marginLeft: 8,
  },
});