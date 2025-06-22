import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, X } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  type: 'window' | 'aisle';
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const passengersCount = 2; // This would come from previous screen

  // Mock seat layout (50 seats, 2x2 configuration)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const occupiedSeats = ['A3', 'A4', 'B7', 'B8', 'C2', 'D5', 'E1', 'F6'];
    
    for (let row = 1; row <= 13; row++) {
      const rowLetter = String.fromCharCode(64 + Math.ceil(row / 2));
      
      // Left side seats
      seats.push({
        id: `${rowLetter}${row}L1`,
        number: `${rowLetter}${row}`,
        status: occupiedSeats.includes(`${rowLetter}${row}`) ? 'occupied' : 'available',
        type: 'window'
      });
      
      seats.push({
        id: `${rowLetter}${row}L2`,
        number: `${rowLetter}${row + 13}`,
        status: occupiedSeats.includes(`${rowLetter}${row + 13}`) ? 'occupied' : 'available',
        type: 'aisle'
      });
      
      // Right side seats
      seats.push({
        id: `${rowLetter}${row}R1`,
        number: `${rowLetter}${row + 26}`,
        status: occupiedSeats.includes(`${rowLetter}${row + 26}`) ? 'occupied' : 'available',
        type: 'aisle'
      });
      
      seats.push({
        id: `${rowLetter}${row}R2`,
        number: `${rowLetter}${row + 39}`,
        status: occupiedSeats.includes(`${rowLetter}${row + 39}`) ? 'occupied' : 'available',
        type: 'window'
      });
    }
    
    return seats.slice(0, 50);
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatPress = (seatId: string, seatNumber: string) => {
    if (seats.find(s => s.id === seatId)?.status === 'occupied') return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < passengersCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatStatus = (seatId: string): 'available' | 'occupied' | 'selected' => {
    if (selectedSeats.includes(seatId)) return 'selected';
    return seats.find(s => s.id === seatId)?.status || 'available';
  };

  const getSeatStyle = (status: 'available' | 'occupied' | 'selected') => {
    switch (status) {
      case 'available':
        return styles.seatAvailable;
      case 'occupied':
        return styles.seatOccupied;
      case 'selected':
        return styles.seatSelected;
      default:
        return styles.seatAvailable;
    }
  };

  const renderSeatRow = (rowSeats: Seat[], rowIndex: number) => (
    <View key={rowIndex} style={styles.seatRow}>
      <Text style={styles.rowNumber}>{rowIndex + 1}</Text>
      
      {/* Left side seats */}
      <View style={styles.seatPair}>
        {rowSeats.slice(0, 2).map((seat) => (
          <TouchableOpacity
            key={seat.id}
            onPress={() => handleSeatPress(seat.id, seat.number)}
            style={[styles.seat, getSeatStyle(getSeatStatus(seat.id))]}
            disabled={seat.status === 'occupied'}
          >
            <Text style={[
              styles.seatText,
              getSeatStatus(seat.id) === 'selected' && styles.seatTextSelected,
              seat.status === 'occupied' && styles.seatTextOccupied
            ]}>
              {seat.number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Aisle */}
      <View style={styles.aisle} />

      {/* Right side seats */}
      <View style={styles.seatPair}>
        {rowSeats.slice(2, 4).map((seat) => (
          <TouchableOpacity
            key={seat.id}
            onPress={() => handleSeatPress(seat.id, seat.number)}
            style={[styles.seat, getSeatStyle(getSeatStatus(seat.id))]}
            disabled={seat.status === 'occupied'}
          >
            <Text style={[
              styles.seatText,
              getSeatStatus(seat.id) === 'selected' && styles.seatTextSelected,
              seat.status === 'occupied' && styles.seatTextOccupied
            ]}>
              {seat.number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Group seats into rows of 4
  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }

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
        <Text style={styles.headerTitle}>Select Seats</Text>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatAvailable]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatSelected]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatOccupied]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>

      {/* Bus Layout */}
      <View style={styles.busContainer}>
        <View style={styles.busHeader}>
          <Text style={styles.busTitle}>SLTB Express - Route 001</Text>
          <Text style={styles.driverLabel}>Driver</Text>
        </View>

        <ScrollView style={styles.seatsContainer} showsVerticalScrollIndicator={false}>
          {seatRows.map((rowSeats, index) => renderSeatRow(rowSeats, index))}
        </ScrollView>
      </View>

      {/* Selected Seats Info */}
      {selectedSeats.length > 0 && (
        <View style={styles.selectedSeatsContainer}>
          <Text style={styles.selectedSeatsTitle}>
            Selected Seats ({selectedSeats.length}/{passengersCount})
          </Text>
          <View style={styles.selectedSeatsList}>
            {selectedSeats.map((seatId) => {
              const seat = seats.find(s => s.id === seatId);
              return (
                <View key={seatId} style={styles.selectedSeatChip}>
                  <Text style={styles.selectedSeatNumber}>{seat?.number}</Text>
                  <TouchableOpacity
                    onPress={() => handleSeatPress(seatId, seat?.number || '')}
                    style={styles.removeSeatButton}
                  >
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Continue Button */}
      <View style={styles.continueContainer}>
        <TouchableOpacity
          onPress={() => router.push('/search/payment')}
          disabled={selectedSeats.length !== passengersCount}
          style={[
            styles.continueButton,
            selectedSeats.length !== passengersCount && styles.continueButtonDisabled
          ]}
        >
          <Text style={[
            styles.continueButtonText,
            selectedSeats.length !== passengersCount && styles.continueButtonTextDisabled
          ]}>
            Continue to Payment
          </Text>
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  busContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  busHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  busTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  driverLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  seatsContainer: {
    flex: 1,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rowNumber: {
    width: 20,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  seatPair: {
    flexDirection: 'row',
    gap: 8,
  },
  aisle: {
    width: 32,
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  seatAvailable: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  seatSelected: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  seatOccupied: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  seatText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  seatTextSelected: {
    color: 'white',
  },
  seatTextOccupied: {
    color: '#9CA3AF',
  },
  selectedSeatsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedSeatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  selectedSeatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSeatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedSeatNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#004CFF',
  },
  removeSeatButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueContainer: {
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
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});