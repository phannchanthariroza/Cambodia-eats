import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import { COLORS } from './src/theme';
import JournalScreen from './src/screens/JournalScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import TogetherScreen from './src/screens/TogetherScreen';
import ShareScreen from './src/screens/ShareScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import PlaceFormScreen from './src/screens/PlaceFormScreen';
import AuthScreen from './src/screens/AuthScreen';

const TABS = [
  { key: 'Journal', label: 'Journal', icon: 'book-open' },
  { key: 'Favorites', label: 'Favorites', icon: 'heart' },
  { key: 'Add', label: 'Add place', icon: 'plus' },
  { key: 'Together', label: 'Together', icon: 'users' },
  { key: 'Share', label: 'Share', icon: 'share-2' },
];

function FoodJournal() {
  const {
    places,
    isLoading,
    isAppwriteConfigured,
    profile,
    compactPhotoMode,
    signIn,
    signUp,
    signOut,
    sendPasswordRecovery,
    resetPassword,
    savePlace,
    removePlace,
    toggleFavorite,
    setCompactPhotoMode,
  } = useApp();
  const [screen, setScreen] = useState('Journal');
  const [activeTab, setActiveTab] = useState('Journal');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formReturnScreen, setFormReturnScreen] = useState('Journal');
  const [shareReturnScreen, setShareReturnScreen] = useState('Journal');
  const [authMode, setAuthMode] = useState('signin');
  const [recoveryDetails, setRecoveryDetails] = useState(null);

  const showActionError = (error) => {
    console.error('Journal action failed:', error);
    Alert.alert('Could not save your change', error.message || 'Check your connection and Appwrite permissions.');
  };

  const handleToggleFavorite = async (placeId) => {
    try {
      await toggleFavorite(placeId);
    } catch (error) {
      showActionError(error);
    }
  };

  const navigate = (target) => {
    if (TABS.some((tab) => tab.key === target)) {
      if (target === 'Add') {
        setEditingPlace(null);
        setFormReturnScreen(activeTab);
        setScreen('PlaceForm');
        return;
      }
      if (target === 'Share') setShareReturnScreen(activeTab);
      setActiveTab(target);
      setScreen(target);
      return;
    }
    setScreen(target);
  };

  const openPlace = (place) => {
    setSelectedPlaceId(place.id);
    setScreen('PlaceDetail');
  };

  const openAddPlace = () => {
    setEditingPlace(null);
    setFormReturnScreen(screen === 'PlaceDetail' ? activeTab : screen);
    setScreen('PlaceForm');
  };

  const openShare = (returnScreen) => {
    setShareReturnScreen(returnScreen);
    setScreen('Share');
  };

  const openEditPlace = (place) => {
    setEditingPlace(place);
    setFormReturnScreen('PlaceDetail');
    setScreen('PlaceForm');
  };

  const goBack = () => {
    if (screen === 'PlaceForm') {
      setScreen(formReturnScreen);
    } else if (screen === 'PlaceDetail') {
      setScreen(activeTab);
    } else if (screen === 'Share') {
      if (TABS.some((tab) => tab.key === shareReturnScreen)) {
        setActiveTab(shareReturnScreen);
      }
      setScreen(shareReturnScreen);
    } else if (screen === 'Auth') {
      if (authMode === 'forgot' || authMode === 'reset') {
        setAuthMode('signin');
        setRecoveryDetails(null);
      } else {
        setScreen('Profile');
      }
    } else {
      setScreen(activeTab);
    }
  };

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen !== activeTab) {
        goBack();
        return true;
      }
      if (activeTab !== 'Journal') {
        setActiveTab('Journal');
        setScreen('Journal');
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [screen, activeTab, formReturnScreen, shareReturnScreen, authMode]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
        <Text style={styles.loadingText}>Opening your journal…</Text>
      </SafeAreaView>
    );
  }

  const selectedPlace = places.find((place) => place.id === selectedPlaceId);
  const showTabs = TABS.some((tab) => tab.key === screen);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>CAMBODIA EATS</Text>
          <Text style={styles.tagline}>FOOD & PLACE JOURNAL</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => navigate('Profile')}
          style={styles.profileButton}
        >
          <Feather name="user" size={18} color={COLORS.terracotta} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {screen === 'Journal' && (
          <JournalScreen
            places={places}
            compactPhotoMode={compactPhotoMode}
            onOpenPlace={openPlace}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {screen === 'Favorites' && (
          <FavoritesScreen
            places={places}
            compactPhotoMode={compactPhotoMode}
            onOpenPlace={openPlace}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {screen === 'Together' && (
          <TogetherScreen
            places={places}
            compactPhotoMode={compactPhotoMode}
            profile={profile}
            onOpenPlace={openPlace}
            onAddPlace={openAddPlace}
            onShare={() => openShare('Together')}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {screen === 'Share' && (
          <ShareScreen
            places={places}
            onBack={() => {
              if (TABS.some((tab) => tab.key === shareReturnScreen)) {
                setActiveTab(shareReturnScreen);
              }
              setScreen(shareReturnScreen);
            }}
          />
        )}
        {screen === 'Profile' && (
          <ProfileScreen
            profile={profile}
            placeCount={places.length}
            compactPhotoMode={compactPhotoMode}
            isAppwriteConfigured={isAppwriteConfigured}
            onBack={goBack}
            onToggleCompactMode={setCompactPhotoMode}
            onSignIn={() => {
              setAuthMode('signin');
              setScreen('Auth');
            }}
            onSignUp={() => {
              setAuthMode('signup');
              setScreen('Auth');
            }}
            onSignOut={() => {
              Alert.alert('Sign out', 'End your Appwrite session on this device?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign out',
                  style: 'destructive',
                  onPress: () => signOut().catch((error) => {
                    Alert.alert('Could not sign out', error.message || 'Check your connection and try again.');
                  }),
                },
              ]);
            }}
          />
        )}
        {screen === 'PlaceDetail' && selectedPlace && (
          <PlaceDetailScreen
            place={selectedPlace}
            compactPhotoMode={compactPhotoMode}
            onBack={goBack}
            onEdit={() => openEditPlace(selectedPlace)}
            onDelete={() => {
              Alert.alert('Delete this place?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await removePlace(selectedPlace.id);
                      setScreen(activeTab);
                    } catch (error) {
                      showActionError(error);
                    }
                  },
                },
              ]);
            }}
            onToggleFavorite={() => handleToggleFavorite(selectedPlace.id)}
            onShare={() => openShare('PlaceDetail')}
          />
        )}
        {screen === 'PlaceDetail' && !selectedPlace && (
          <View style={styles.missingPlace}>
            <Text style={styles.missingText}>This place is no longer in your journal.</Text>
            <Pressable onPress={goBack}><Text style={styles.backLink}>Go back</Text></Pressable>
          </View>
        )}
        {screen === 'PlaceForm' && (
          <PlaceFormScreen
            place={editingPlace}
            onBack={goBack}
            onSave={async (values) => {
              await savePlace(values, editingPlace && editingPlace.id);
              setScreen(formReturnScreen);
            }}
          />
        )}
        {screen === 'Auth' && (
          <AuthScreen
            mode={authMode}
            isAppwriteConfigured={isAppwriteConfigured}
            recoveryDetails={recoveryDetails}
            onBack={() => {
              if (authMode === 'forgot' || authMode === 'reset') {
                setAuthMode('signin');
                setRecoveryDetails(null);
              } else {
                goBack();
              }
            }}
            onSignIn={async (credentials) => {
              await signIn(credentials);
              setAuthMode('signin');
              setScreen('Profile');
            }}
            onSignUp={async (details) => {
              await signUp(details);
              setAuthMode('signin');
              setScreen('Profile');
            }}
            onRecover={async (email) => {
              const token = await sendPasswordRecovery(email);
              setRecoveryDetails({ userId: token.userId });
              setAuthMode('reset');
              Alert.alert('Check your email', 'Enter the 6-digit Appwrite recovery code to choose a new password.');
            }}
            onResetPassword={async (credentials) => {
              await resetPassword(credentials);
              Alert.alert('Password updated', 'You can now sign in with your new password.');
              setRecoveryDetails(null);
              setAuthMode('signin');
            }}
            onForgotPassword={() => setAuthMode('forgot')}
          />
        )}
      </View>

      {showTabs && (
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const isAdd = tab.key === 'Add';
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                onPress={() => navigate(tab.key)}
                style={styles.tab}
              >
                <View style={[styles.tabIcon, isAdd && styles.addTabIcon]}>
                  <Feather
                    name={tab.icon}
                    size={isAdd ? 21 : 19}
                    color={isAdd ? COLORS.white : active ? COLORS.terracotta : COLORS.muted}
                  />
                </View>
                <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FoodJournal />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.paper },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paper,
  },
  loadingText: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
  header: {
    minHeight: 62,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  brand: { color: COLORS.terracotta, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  tagline: { color: COLORS.inkSoft, fontSize: 9, letterSpacing: 1.4, marginTop: 3 },
  profileButton: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: COLORS.terracottaLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  tabBar: {
    minHeight: 64,
    backgroundColor: COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  tabIcon: { height: 25, alignItems: 'center', justifyContent: 'center' },
  addTabIcon: {
    width: 38,
    height: 38,
    marginTop: -14,
    borderRadius: 19,
    backgroundColor: COLORS.terracotta,
    borderWidth: 3,
    borderColor: COLORS.paper,
  },
  tabLabel: { color: COLORS.muted, fontSize: 9, marginTop: 2, fontWeight: '500' },
  activeTabLabel: { color: COLORS.terracotta, fontWeight: '700' },
  missingPlace: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  missingText: { color: COLORS.inkSoft, fontSize: 15, marginBottom: 10 },
  backLink: { color: COLORS.terracotta, fontWeight: '700' },
});
