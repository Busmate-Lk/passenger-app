import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock, Plus, UserPlus } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import AppHeader from '@/components/ui/AppHeader';

interface Passenger {
  id: string;
  name: string;
  gender: 'male' | 'female';
  phone: string;
}

export default function BookingScreen() {
  const router = useRouter();
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: '', gender: 'male', phone: '' }
  ]);

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      name: '',
      gender: 'male',
      phone: ''
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

  const isFormValid = () => {
    return passengers.every(p => p.name.trim() !== '' && p.phone.trim() !== '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Booking Details" />

      <ScrollView style={styles.content}>
        {/* Trip Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <View style={styles.tripDetails}>
            <View style={styles.tripRow}>
              <MapPin size={16} color="#004CFF" />
              <Text style={styles.tripText}>{bookingDetails.route}</Text>
            </View>
            <View style={styles.tripRow}>
              <Calendar size={16} color="#004CFF" />
              <Text style={styles.tripText}>{bookingDetails.date}</Text>
            </View>
            <View style={styles.tripRow}>
              <Clock size={16} color="#004CFF" />
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
              <UserPlus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {passengers.map((passenger, index) => (
            <View key={passenger.id} style={[
              styles.passengerForm,
              index === passengers.length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }
            ]}>
              <View style={styles.passengerHeader}>
                <View style={styles.passengerBadge}>
                  <Text style={styles.passengerBadgeText}>{index + 1}</Text>
                </View>
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
                  <Text style={styles.inputLabel}>Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color="#6B7280" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter name"
                      value={passenger.name}
                      onChangeText={(text) => updatePassenger(passenger.id, 'name', text)}
                    />
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
            </View>
          ))}

          <View style={styles.passengerNotes}>
            <Text style={styles.noteText}>* We only need essential information to complete your booking</Text>
          </View>
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
          style={[styles.continueButton, !isFormValid() && styles.continueButtonDisabled]}
          disabled={!isFormValid()}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    flex: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004CFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  passengerForm: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  passengerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
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
  passengerNotes: {
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});