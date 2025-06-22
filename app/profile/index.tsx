import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Settings, 
  CreditCard, 
  Heart, 
  Bell, 
  Globe, 
  LogOut,
  Shield,
  HelpCircle,
  Star,
  AlertTriangle
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const router = useRouter();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+94 77 123 4567',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: 'January 2023',
    totalTrips: 24,
    savedRoutes: 8
  };

  // Handle logout action
  const handleLogout = () => {
    // Here you would implement actual logout logic:
    // - Clear authentication tokens
    // - Clear user data from local storage
    // - Reset any app state
    
    // Close the modal
    setIsLogoutModalVisible(false);
    
    // Navigate to login screen or home screen
    router.replace('/auth/login');
  };

  // Profile menu items
  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User size={20} color="#004CFF" />,
      route: '/profile/profile'
    },
    {
      id: 'change-password',
      title: 'Change Password',
      icon: <User size={20} color="#004CFF" />,
      route: '/profile/change-password'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: <CreditCard size={20} color="#004CFF" />,
      route: '/profile/(payment)/payment-methods'
    },
    {
      id: 'favorites',
      title: 'Favorite Routes',
      icon: <Heart size={20} color="#004CFF" />,
      route: '/profile/favorites',
      badge: userData.savedRoutes
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: <Bell size={20} color="#004CFF" />,
      route: '/profile/notification-preferences'
    },
    {
      id: 'language',
      title: 'Language & Accessibility',
      icon: <Globe size={20} color="#004CFF" />,
      route: '/profile/accessibility'
    }
  ];

  const supportItems = [
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle size={20} color="#6B7280" />
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield size={20} color="#6B7280" />
    },
    {
      id: 'rate',
      title: 'Rate Our App',
      icon: <Star size={20} color="#6B7280" />
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: userData.profileImage }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileDetail}>{userData.phone}</Text>
            <Text style={styles.profileDetail}>{userData.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={[styles.statItem, { flex: 2 }]}>
            <Text style={styles.statValue}>{userData.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={[styles.statItem, { flex: 2 }]}>
            <Text style={styles.statValue}>{userData.savedRoutes}</Text>
            <Text style={styles.statLabel}>Saved Routes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={[styles.statItem, { flex: 3 }]}>
            <Text style={styles.statValue}>{userData.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>
        
        {/* Profile Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => router.push(item.route)}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
            >
              <View style={styles.menuIcon}>
                {item.icon}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              {item.badge && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support */}
        <View style={styles.menuCard}>
          {supportItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.menuItem,
                index === supportItems.length - 1 && styles.menuItemLast
              ]}
            >
              <View style={styles.menuIcon}>
                {item.icon}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setIsLogoutModalVisible(true)}
        >
          <LogOut size={20} color="#FF3831" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <AlertTriangle size={32} color="#FF3831" />
            </View>
            
            <Text style={styles.modalTitle}>
              Log Out
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to log out of your account?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EBF2FF',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#004CFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  badgeContainer: {
    backgroundColor: '#EBF2FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#004CFF',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3831',
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: '#FF3831',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
  confirmLogoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});