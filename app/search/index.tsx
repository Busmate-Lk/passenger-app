import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Search as SearchIcon,
  Filter,
  ArrowRightLeft,
  ArrowLeft,
  Clock,
} from 'lucide-react-native';
import RouteFilterModal from '../../components/modals/RouteFilterModal';
import mockData from '../../data/mockBusRouteData.json';

interface FilterOptionsType {
  priceRange: [number, number];
  departureTime: string[];
  busType: string[];
  amenities: string[];
  operators: string[];
  date?: Date;
  endDate?: Date;
  isDateRange: boolean;
  passengers: number;
}

export default function SearchScreen() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Colombo Fort to Kandy',
    'Negombo to Colombo',
    'Galle to Colombo',
  ]);

  // Get popular destinations from mock data
  const popularDestinations = mockData.destinations.slice(0, 6);

  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>({
    priceRange: [100, 500],
    departureTime: [],
    busType: [],
    amenities: [],
    operators: [],
    date: new Date(),
    endDate: undefined,
    isDateRange: false,
    passengers: 1
  });

  const handleSearch = () => {
    if (!from || !to) {
      return;
    }

    // Save to recent searches
    const searchString = `${from} to ${to}`;
    if (!recentSearches.includes(searchString)) {
      setRecentSearches(prev => [searchString, ...prev].slice(0, 5));
    }

    // Navigate to results with search parameters
    router.push({
      pathname: '/search/results',
      params: {
        from,
        to,
        date: filterOptions.date ? filterOptions.date.toISOString() : '',
        endDate: filterOptions.endDate ? filterOptions.endDate.toISOString() : '',
        passengers: filterOptions.passengers.toString(),
        // Convert complex filter object to JSON string
        filters: JSON.stringify(filterOptions)
      }
    });
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const applyFilters = (newFilters: FilterOptionsType) => {
    setFilterOptions(newFilters);
  };

  const formatFilterSummary = () => {
    const parts = [];

    // Date info
    if (filterOptions.date) {
      if (filterOptions.isDateRange && filterOptions.endDate) {
        parts.push(`${filterOptions.date.toLocaleDateString()} - ${filterOptions.endDate.toLocaleDateString()}`);
      } else {
        parts.push(filterOptions.date.toLocaleDateString());
      }
    }

    // Passenger info
    parts.push(`${filterOptions.passengers} passenger${filterOptions.passengers !== 1 ? 's' : ''}`);

    // Other filter selections
    const activeFilters = [
      ...filterOptions.departureTime,
      ...filterOptions.busType,
      ...filterOptions.amenities,
      ...filterOptions.operators
    ];

    if (activeFilters.length > 0) {
      parts.push(`${activeFilters.length} filter${activeFilters.length !== 1 ? 's' : ''}`);
    }

    return parts.join(' • ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Bus Routes</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          {/* Search Form */}
          <View style={styles.searchForm}>
            {/* Search inputs container */}
            <View style={styles.searchInputsContainer}>
              {/* From */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>From</Text>
                <View style={[styles.inputWrapper, styles.fromInput]}>
                  <MapPin size={18} color="#1DD724" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter departure location"
                    value={from}
                    onChangeText={setFrom}
                  />
                </View>
              </View>

              {/* To */}
              <View style={[styles.inputContainer, styles.toInputContainer]}>
                <Text style={styles.inputLabel}>To</Text>
                <View style={[styles.inputWrapper, styles.toInput]}>
                  <MapPin size={18} color="#FF3831" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter destination"
                    value={to}
                    onChangeText={setTo}
                  />
                </View>
              </View>

              {/* Swap Button */}
              <TouchableOpacity
                style={styles.swapButton}
                onPress={swapLocations}
              >
                <ArrowRightLeft size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Filter summary */}
            <TouchableOpacity
              style={styles.filterSummary}
              onPress={() => setShowFilterModal(true)}
            >
              <Clock size={16} color="#6B7280" />
              <Text style={styles.filterSummaryText}>
                {formatFilterSummary()}
              </Text>
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity
              style={[
                styles.searchButton,
                (!from || !to) && styles.searchButtonDisabled
              ]}
              onPress={handleSearch}
              disabled={!from || !to}
            >
              <SearchIcon size={18} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Search Routes</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => {
                    const [fromStr, toStr] = search.split(' to ');
                    setFrom(fromStr);
                    setTo(toStr);
                  }}
                >
                  <View style={styles.recentSearchIcon}>
                    <Clock size={16} color="#004CFF" />
                  </View>
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Popular Destinations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <View style={styles.destinationsGrid}>
              {popularDestinations.map((destination, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.destinationChip}
                  onPress={() => setTo(destination)}
                >
                  <Text style={styles.destinationText}>{destination}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <RouteFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={applyFilters}
      />
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  searchForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInputsContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
  toInputContainer: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  fromInput: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  toInput: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 52,
    height: 52,
    borderRadius: 50,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  filterSummaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004CFF',
    borderRadius: 12,
    paddingVertical: 14,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    color: '#004CFF',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentSearchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#374151',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginHorizontal: -4,
  },
  destinationChip: {
    backgroundColor: '#EBF2FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  destinationText: {
    fontSize: 14,
    color: '#004CFF',
  },
});