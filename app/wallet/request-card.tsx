import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, User, Home, Phone, FileText, Check, RefreshCw } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function RequestCardScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    idNumber: '',
    deliveryAddress: 'same',
    alternateAddress: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Request Submitted",
        "Your travel card request has been submitted successfully. You will receive updates on your request status.",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    }, 2000);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    if (!formData.idNumber.trim()) {
      Alert.alert("Error", "Please enter your ID number");
      return false;
    }
    if (formData.deliveryAddress === 'alternate' && !formData.alternateAddress.trim()) {
      Alert.alert("Error", "Please enter your alternate address");
      return false;
    }
    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions");
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
        <Text style={styles.headerTitle}>Request Travel Card</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardIconContainer}>
            <CreditCard size={24} color="#004CFF" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoTitle}>Physical Travel Card</Text>
            <Text style={styles.cardInfoText}>
              Request a physical travel card to use on all buses and routes. 
              Card will be delivered to your address within 7-10 business days.
            </Text>
            <View style={styles.feeContainer}>
              <Text style={styles.feeText}>Card fee:</Text>
              <Text style={styles.feeAmount}>LKR 200.00</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Residential Address</Text>
            <View style={styles.inputContainer}>
              <Home size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your address"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                multiline
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Number</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your NIC number"
                value={formData.idNumber}
                onChangeText={(text) => handleChange('idNumber', text)}
              />
            </View>
          </View>

          <Text style={styles.formTitle}>Delivery Information</Text>
          
          <View style={styles.radioGroup}>
            <TouchableOpacity
              onPress={() => handleChange('deliveryAddress', 'same')}
              style={styles.radioOption}
            >
              <View style={[
                styles.radioButton,
                formData.deliveryAddress === 'same' && styles.radioButtonSelected
              ]}>
                {formData.deliveryAddress === 'same' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioText}>Deliver to my residential address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleChange('deliveryAddress', 'alternate')}
              style={styles.radioOption}
            >
              <View style={[
                styles.radioButton,
                formData.deliveryAddress === 'alternate' && styles.radioButtonSelected
              ]}>
                {formData.deliveryAddress === 'alternate' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioText}>Deliver to a different address</Text>
            </TouchableOpacity>
          </View>

          {formData.deliveryAddress === 'alternate' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alternate Address</Text>
              <View style={styles.inputContainer}>
                <Home size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter alternate delivery address"
                  value={formData.alternateAddress}
                  onChangeText={(text) => handleChange('alternateAddress', text)}
                  multiline
                />
              </View>
            </View>
          )}

          {/* Terms and Conditions */}
          <TouchableOpacity
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            style={styles.termsContainer}
          >
            <View style={[
              styles.checkbox,
              agreeToTerms && styles.checkboxSelected
            ]}>
              {agreeToTerms && <Check size={14} color="white" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fee Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Fee Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Card Fee</Text>
            <Text style={styles.summaryValue}>LKR 200.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>LKR 50.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotalValue}>LKR 250.00</Text>
          </View>
          <Text style={styles.summaryNote}>
            Amount will be deducted from your wallet balance upon approval
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isProcessing}
          style={[
            styles.submitButton,
            isProcessing && styles.submitButtonDisabled
          ]}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <RefreshCw size={20} color="white" />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardInfoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 4,
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004CFF',
  },
  formContainer: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  radioText: {
    fontSize: 16,
    color: '#374151',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#004CFF',
    fontWeight: '500',
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004CFF',
  },
  summaryNote: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginTop: 8,
  },
  submitContainer: {
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
  submitButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});