import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Lock, Check } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
}

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      icon: Smartphone,
      description: 'eZ Cash, mCash, Dialog Pay',
      enabled: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Use your SmartBus wallet balance',
      enabled: true
    }
  ];

  const bookingSummary = {
    route: 'Colombo Fort → Kandy',
    date: 'Today, Jan 15',
    time: '08:30 AM',
    passengers: 2,
    seats: ['A12', 'A13'],
    baseFare: 500,
    serviceFee: 25,
    total: 525
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
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
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Route</Text>
              <Text style={styles.summaryValue}>{bookingSummary.route}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date & Time</Text>
              <Text style={styles.summaryValue}>{bookingSummary.date} at {bookingSummary.time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Passengers</Text>
              <Text style={styles.summaryValue}>{bookingSummary.passengers} passengers</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Seats</Text>
              <Text style={styles.summaryValue}>{bookingSummary.seats.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPaymentMethod(method.id)}
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethod === method.id && styles.paymentMethodItemSelected
              ]}
              disabled={!method.enabled}
            >
              <View style={styles.paymentMethodIcon}>
                <method.icon size={24} color={selectedPaymentMethod === method.id ? '#004CFF' : '#6B7280'} />
              </View>
              <View style={styles.paymentMethodInfo}>
                <Text style={[
                  styles.paymentMethodName,
                  selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
                ]}>
                  {method.name}
                </Text>
                <Text style={styles.paymentMethodDescription}>{method.description}</Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <View style={styles.selectedIndicator}>
                  <Check size={16} color="#004CFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Details */}
        {selectedPaymentMethod === 'card' && (
          <View style={styles.paymentDetailsCard}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputWrapper}>
                <CreditCard size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.textInputSmall}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInputSmall}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInputSmall}
                placeholder="John Doe"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.securityNote}>
              <Lock size={16} color="#1DD724" />
              <Text style={styles.securityText}>Your payment information is encrypted and secure</Text>
            </View>
          </View>
        )}

        {selectedPaymentMethod === 'mobile' && (
          <View style={styles.paymentDetailsCard}>
            <Text style={styles.sectionTitle}>Mobile Payment</Text>
            <Text style={styles.mobilePaymentText}>
              You will be redirected to your mobile payment provider to complete the transaction.
            </Text>
            <View style={styles.mobileProviders}>
              <TouchableOpacity style={styles.providerButton}>
                <Text style={styles.providerText}>eZ Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.providerButton}>
                <Text style={styles.providerText}>mCash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.providerButton}>
                <Text style={styles.providerText}>Dialog Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedPaymentMethod === 'wallet' && (
          <View style={styles.paymentDetailsCard}>
            <Text style={styles.sectionTitle}>Wallet Payment</Text>
            <View style={styles.walletBalance}>
              <Text style={styles.walletBalanceLabel}>Available Balance</Text>
              <Text style={styles.walletBalanceAmount}>LKR 1,500</Text>
            </View>
            <Text style={styles.walletNote}>
              {bookingSummary.total <= 1500 
                ? 'You have sufficient balance to complete this payment.'
                : 'Insufficient balance. Please top up your wallet or choose another payment method.'
              }
            </Text>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base fare ({bookingSummary.passengers} passengers)</Text>
            <Text style={styles.priceValue}>LKR {bookingSummary.baseFare}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>LKR {bookingSummary.serviceFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>LKR {bookingSummary.total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.payContainer}>
        <TouchableOpacity
          onPress={() => router.push('/search/summary')}
          style={styles.payButton}
        >
          <Text style={styles.payButtonText}>Pay LKR {bookingSummary.total}</Text>
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
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryDetails: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  paymentMethodsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  paymentMethodItemSelected: {
    borderColor: '#004CFF',
    backgroundColor: '#EBF2FF',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  paymentMethodNameSelected: {
    color: '#004CFF',
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
  },
  textInputSmall: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#166534',
  },
  mobilePaymentText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  mobileProviders: {
    flexDirection: 'row',
    gap: 12,
  },
  providerButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  providerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  walletBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  walletBalanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  walletBalanceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004CFF',
  },
  walletNote: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 120,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004CFF',
  },
  payContainer: {
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
  payButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});