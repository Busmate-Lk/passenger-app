import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import BusRouteCard, { RouteResult } from '../../components/BusRouteCard';
import RouteFilterModal from '../../components/modals/RouteFilterModal';
import mockData from '../../data/mockBusRouteData.json';
import AppHeader from '../../components/ui/AppHeader';

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

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState<RouteResult[]>([]);

  // Parse parameters from search - Fix the date parsing
  const from = params.from as string || 'Colombo Fort';
  const to = params.to as string || 'Kandy';
  const passengers = parseInt(params.passengers as string) || 1;
  
  // Better date handling
  const searchDate = (() => {
    if (params.date && typeof params.date === 'string' && params.date.trim() !== '') {
      const parsedDate = new Date(params.date);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return new Date();
  })();
  
  // Parse filter options from params or use defaults
  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>(() => {
    if (params.filters) {
      try {
        const parsed = JSON.parse(params.filters as string);
        
        // Ensure date fields are properly converted back to Date objects
        if (parsed.date && typeof parsed.date === 'string') {
          const parsedDate = new Date(parsed.date);
          parsed.date = isNaN(parsedDate.getTime()) ? searchDate : parsedDate;
        } else {
          parsed.date = searchDate;
        }
        
        if (parsed.endDate && typeof parsed.endDate === 'string') {
          const parsedEndDate = new Date(parsed.endDate);
          parsed.endDate = isNaN(parsedEndDate.getTime()) ? undefined : parsedEndDate;
        }
        
        return parsed;
      } catch (e) {
        console.log('Error parsing filters:', e);
      }
    }
    return {
      priceRange: [100, 500],
      departureTime: [],
      busType: [],
      amenities: [],
      operators: [],
      date: searchDate,
      endDate: undefined,
      isDateRange: false,
      passengers: passengers
    };
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'cheapest', label: 'Cheapest' },
    { id: 'fastest', label: 'Fastest' },
    { id: 'highest-rated', label: 'Highest Rated' }
  ];

  // Filter and sort routes based on search criteria and filters
  useEffect(() => {
    let routes = mockData.routes.filter(route => {
      // Basic route matching (case insensitive)
      const matchesRoute = route.from.toLowerCase().includes(from.toLowerCase()) &&
                          route.to.toLowerCase().includes(to.toLowerCase());
      
      if (!matchesRoute) return false;

      // Apply filters
      // Price range filter
      if (route.price < filterOptions.priceRange[0] || route.price > filterOptions.priceRange[1]) {
        return false;
      }

      // Bus type filter
      if (filterOptions.busType.length > 0 && !filterOptions.busType.includes('all')) {
        if (!filterOptions.busType.includes(route.busType)) {
          return false;
        }
      }

      // Operators filter
      if (filterOptions.operators.length > 0) {
        if (!filterOptions.operators.includes(route.operatorId)) {
          return false;
        }
      }

      // Amenities filter
      if (filterOptions.amenities.length > 0) {
        const hasAllAmenities = filterOptions.amenities.every(amenity => 
          route.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Departure time filter
      if (filterOptions.departureTime.length > 0 && !filterOptions.departureTime.includes('any')) {
        const hour = parseInt(route.departureTime.split(':')[0]);
        const matchesTimeSlot = filterOptions.departureTime.some(timeSlot => {
          switch (timeSlot) {
            case 'morning': return hour >= 6 && hour < 12;
            case 'afternoon': return hour >= 12 && hour < 17;
            case 'evening': return hour >= 17 && hour < 21;
            case 'night': return hour >= 21 || hour < 6;
            default: return true;
          }
        });
        if (!matchesTimeSlot) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting based on selected filter
    switch (selectedFilter) {
      case 'cheapest':
        routes.sort((a, b) => a.price - b.price);
        break;
      case 'fastest':
        routes.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].split('m')[0]);
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].split('m')[0]);
          return durationA - durationB;
        });
        break;
      case 'highest-rated':
        routes.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredRoutes(routes);
  }, [from, to, filterOptions, selectedFilter]);

  const applyFilters = (newFilters: FilterOptionsType) => {
    setFilterOptions(newFilters);
  };

  const handleRoutePress = (route: RouteResult) => {
    router.push({
      pathname: '/search/schedule',
      params: {
        routeId: route.id,
        from,
        to,
        passengers: passengers.toString()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        title={`${from} → ${to}`}
        rightElement={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />
      
      {/* Search Info */}
      {/* <View style={styles.searchInfoContainer}>
        <Text style={styles.searchInfoText}>
          {searchDate.toLocaleDateString()} • {passengers} passenger{passengers !== 1 ? 's' : ''}
        </Text>
      </View> */}

      {/* Quick Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.quickFilterButton,
                selectedFilter === filter.id && styles.quickFilterButtonActive
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>
          {filteredRoutes.length} bus{filteredRoutes.length !== 1 ? 'es' : ''} found
        </Text>
        
        {filteredRoutes.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>No buses found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your filters or search criteria
            </Text>
          </View>
        ) : (
          filteredRoutes.map((result) => (
            <BusRouteCard 
              key={result.id}
              route={result} 
              onPress={() => handleRoutePress(result)}
              showAmenities={false}
            />
          ))
        )}
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
  searchInfoContainer: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchInfoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
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
  },
  filtersScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickFilterButtonActive: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginVertical: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});