import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

interface Passenger {
  id: string;
  name: string;
  age: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

export default function BookingScreen() {
  const router = useRouter();
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: '', age: '', gender: 'male', phone: '', email: '' }
  ]);

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      email: ''
    };
    setPassengers([...passengers, newPassenger]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const bookingDetails = {
    route: 'Colombo Fort → Kandy',
    date: 'Today, Jan 15',
    time: '08:30 AM',
    duration: '2h 30m',
    operator: 'SLTB Express',
    routeNumber: '001',
    price: 250
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
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <View style={styles.tripDetails}>
            <View style={styles.tripRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.tripText}>{bookingDetails.route}</Text>
            </View>
            <View style={styles.tripRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.tripText}>{bookingDetails.date}</Text>
            </View>
            <View style={styles.tripRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.tripText}>{bookingDetails.time} • {bookingDetails.duration}</Text>
            </View>
          </View>
          <View style={styles.operatorInfo}>
            <Text style={styles.operatorName}>{bookingDetails.operator}</Text>
            <Text style={styles.routeNumber}>Route {bookingDetails.routeNumber}</Text>
          </View>
        </View>

        {/* Passenger Information */}
        <View style={styles.passengersCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Passenger Information</Text>
            <TouchableOpacity onPress={addPassenger} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Passenger</Text>
            </TouchableOpacity>
          </View>

          {passengers.map((passenger, index) => (
            <View key={passenger.id} style={styles.passengerForm}>
              <View style={styles.passengerHeader}>
                <Text style={styles.passengerTitle}>Passenger {index + 1}</Text>
                {passengers.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removePassenger(passenger.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color="#6B7280" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter full name"
                      value={passenger.name}
                      onChangeText={(text) => updatePassenger(passenger.id, 'name', text)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.textInputSmall}
                    placeholder="Age"
                    keyboardType="numeric"
                    value={passenger.age}
                    onChangeText={(text) => updatePassenger(passenger.id, 'age', text)}
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      onPress={() => updatePassenger(passenger.id, 'gender', 'male')}
                      style={[
                        styles.genderButton,
                        passenger.gender === 'male' && styles.genderButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.genderText,
                        passenger.gender === 'male' && styles.genderTextActive
                      ]}>
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updatePassenger(passenger.id, 'gender', 'female')}
                      style={[
                        styles.genderButton,
                        passenger.gender === 'female' && styles.genderButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.genderText,
                        passenger.gender === 'female' && styles.genderTextActive
                      ]}>
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={16} color="#6B7280" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="+94 77 123 4567"
                      keyboardType="phone-pad"
                      value={passenger.phone}
                      onChangeText={(text) => updatePassenger(passenger.id, 'phone', text)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color="#6B7280" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="email@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={passenger.email}
                      onChangeText={(text) => updatePassenger(passenger.id, 'email', text)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</Text>
            <Text style={styles.priceValue}>LKR {bookingDetails.price * passengers.length}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>LKR 25</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>LKR {(bookingDetails.price * passengers.length) + 25}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.continueContainer}>
        <TouchableOpacity
          onPress={() => router.push('/search/seat-selection')}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue to Seat Selection</Text>
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
  tripDetails: {
    gap: 12,
    marginBottom: 16,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripText: {
    fontSize: 14,
    color: '#6B7280',
  },
  operatorInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  operatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  routeNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  passengersCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EBF2FF',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#004CFF',
  },
  passengerForm: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#FF3831',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
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
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  genderTextActive: {
    color: 'white',
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
  continueContainer: {
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
  continueButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});