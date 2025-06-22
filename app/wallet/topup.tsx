import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Wallet, Plus, RefreshCw, Check } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function TopupScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Predefined top-up amounts
  const quickAmounts = [500, 1000, 2000, 5000];

  // Payment method options
  const paymentMethods = [
    { id: 'credit_card', title: 'Credit / Debit Card', icon: <CreditCard size={24} color="#374151" /> },
    { id: 'bank_transfer', title: 'Online Banking', icon: <Wallet size={24} color="#374151" /> },
  ];

  // Handle custom amount input
  const handleAmountChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  // Handle amount selection
  const handleSelectAmount = (value) => {
    setAmount(value.toString());
  };

  // Handle payment method selection
  const handleSelectPaymentMethod = (id) => {
    setSelectedPaymentMethod(id);
  };

  // Process top-up request
  const handleTopup = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Top-up Successful",
        `LKR ${amount} has been added to your wallet.`,
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    }, 2000);
  };

  // Form validation
  const validateForm = () => {
    const numericAmount = parseInt(amount);
    
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return false;
    }
    
    if (numericAmount < 100) {
      Alert.alert("Error", "Minimum top-up amount is LKR 100");
      return false;
    }
    
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return false;
    }
    
    return true;
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
        <Text style={styles.headerTitle}>Top Up Wallet</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>LKR 1,250.00</Text>
        </View>

        {/* Amount Entry */}
        <View style={styles.amountContainer}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencySymbol}>LKR</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.quickAmountContainer}>
            <Text style={styles.quickAmountLabel}>Quick Amounts</Text>
            <View style={styles.quickAmountButtons}>
              {quickAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleSelectAmount(value)}
                  style={[
                    styles.quickAmountButton,
                    amount === value.toString() && styles.quickAmountButtonSelected
                  ]}
                >
                  <Text 
                    style={[
                      styles.quickAmountText,
                      amount === value.toString() && styles.quickAmountTextSelected
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentOptions}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => handleSelectPaymentMethod(method.id)}
                style={[
                  styles.paymentMethodCard,
                  selectedPaymentMethod === method.id && styles.paymentMethodCardSelected
                ]}
              >
                <View style={styles.paymentMethodIcon}>
                  {method.icon}
                </View>
                <Text style={styles.paymentMethodTitle}>{method.title}</Text>
                <View style={[
                  styles.radioButton,
                  selectedPaymentMethod === method.id && styles.radioButtonSelected
                ]}>
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transaction Fee */}
        <View style={styles.feeContainer}>
          <Text style={styles.feeTitle}>Transaction Details</Text>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Amount</Text>
            <Text style={styles.feeValue}>
              {amount ? `LKR ${parseInt(amount).toLocaleString()}` : 'LKR 0'}
            </Text>
          </View>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Transaction Fee</Text>
            <Text style={styles.feeValue}>LKR 0</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.feeRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {amount ? `LKR ${parseInt(amount).toLocaleString()}` : 'LKR 0'}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesContainer}>
          <View style={styles.noteItem}>
            <Check size={16} color="#1DD724" />
            <Text style={styles.noteText}>Funds will be available immediately after top-up</Text>
          </View>
          <View style={styles.noteItem}>
            <Check size={16} color="#1DD724" />
            <Text style={styles.noteText}>No transaction fees for wallet top-ups</Text>
          </View>
          <View style={styles.noteItem}>
            <Check size={16} color="#1DD724" />
            <Text style={styles.noteText}>Top-up transactions are protected with bank-level security</Text>
          </View>
        </View>
      </ScrollView>

      {/* Top Up Button */}
      <View style={styles.topupContainer}>
        <TouchableOpacity
          onPress={handleTopup}
          disabled={isProcessing || !amount || !selectedPaymentMethod}
          style={[
            styles.topupButton,
            (isProcessing || !amount || !selectedPaymentMethod) && styles.topupButtonDisabled
          ]}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <RefreshCw size={20} color="white" />
              <Text style={styles.topupButtonText}>Processing...</Text>
            </View>
          ) : (
            <>
              <Plus size={20} color="white" />
              <Text style={styles.topupButtonText}>Top Up Now</Text>
            </>
          )}
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
    paddingTop: 16,
    paddingBottom: 90,
  },
  balanceContainer: {
    backgroundColor: '#004CFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  amountContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 16,
  },
  quickAmountContainer: {
    marginTop: 8,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: '#F3F4F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#EBF2FF',
    borderWidth: 1,
    borderColor: '#004CFF',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  quickAmountTextSelected: {
    color: '#004CFF',
  },
  paymentMethodContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  paymentMethodCardSelected: {
    backgroundColor: '#EBF2FF',
    borderColor: '#004CFF',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#004CFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#004CFF',
  },
  feeContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  feeValue: {
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
  notesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
  },
  topupContainer: {
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
  topupButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  topupButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  topupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});