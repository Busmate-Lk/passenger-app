import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, Share, Maximize2 } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function QRCodeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [brightness, setBrightness] = useState(1);
  const screenWidth = Dimensions.get('window').width;
  const qrSize = screenWidth - 80;

  // Mock ticket data
  const ticketData = {
    bookingId: 'SB2024011501',
    route: { from: 'Colombo Fort', to: 'Kandy' },
    date: 'Today, Jan 15',
    time: '08:30 AM',
    seatNumber: 'A12',
    qrCode: 'QR123456789'
  };

  // Generate QR code pattern (mock)
  const generateQRPattern = () => {
    const size = 25;
    const pattern = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create a pseudo-random pattern based on position
        const value = (i * j + i + j) % 3 === 0;
        row.push(value);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: brightness > 0.8 ? 'white' : '#F3F4F9' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code</Text>
        <TouchableOpacity
          onPress={() => setBrightness(brightness > 0.8 ? 0.3 : 1)}
          style={styles.brightnessButton}
        >
          <Maximize2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Ticket Info */}
        <View style={styles.ticketInfo}>
          <Text style={styles.routeText}>{ticketData.route.from} → {ticketData.route.to}</Text>
          <Text style={styles.dateText}>{ticketData.date} • {ticketData.time}</Text>
          <Text style={styles.seatText}>Seat {ticketData.seatNumber}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={[styles.qrCode, { width: qrSize, height: qrSize }]}>
            {qrPattern.map((row, i) => (
              <View key={i} style={styles.qrRow}>
                {row.map((cell, j) => (
                  <View
                    key={j}
                    style={[
                      styles.qrCell,
                      {
                        backgroundColor: cell ? '#000' : 'transparent',
                        width: qrSize / 25,
                        height: qrSize / 25,
                      }
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
          
          {/* QR Code Border */}
          <View style={styles.qrBorder} />
          
          {/* Corner Markers */}
          <View style={[styles.cornerMarker, styles.topLeft]} />
          <View style={[styles.cornerMarker, styles.topRight]} />
          <View style={[styles.cornerMarker, styles.bottomLeft]} />
          <View style={[styles.cornerMarker, styles.bottomRight]} />
        </View>

        {/* Booking ID */}
        <Text style={styles.bookingId}>#{ticketData.bookingId}</Text>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to use this QR code:</Text>
          <Text style={styles.instructionText}>• Show this code to the bus conductor</Text>
          <Text style={styles.instructionText}>• Keep your phone screen bright</Text>
          <Text style={styles.instructionText}>• Have a backup screenshot ready</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#004CFF" />
            <Text style={styles.actionButtonText}>Save to Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#004CFF" />
            <Text style={styles.actionButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  brightnessButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  ticketInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  routeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  seatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  qrContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  qrCode: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    // Individual QR code cells
  },
  qrBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: '#004CFF',
  },
  topLeft: {
    top: 15,
    left: 15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 15,
    right: 15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 15,
    left: 15,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 15,
    right: 15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004CFF',
    marginBottom: 32,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
});