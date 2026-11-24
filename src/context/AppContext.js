import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_PLACES } from '../data/seedPlaces';
import {
  account,
  ID,
  isAppwriteConfigured,
  Permission,
  Query,
  Role,
  tablesDB,
  appwriteConfig,
} from '../lib/appwrite';

const STORAGE_KEY = 'cambodia-eats-v1';
const AppContext = createContext(null);

function isNoActiveSession(error) {
  return Number(error && error.code) === 401;
}

function toPlace(row, user) {
  return {
    id: row.$id,
    name: row.name,
    province: row.province,
    price: Number(row.price),
    rating: Number(row.rating),
    category: row.category,
    notes: row.notes || '',
    image: row.image || '',
    isFavorite: Boolean(row.isFavorite),
    collection: row.collection || 'Only my journal',
    addedBy: row.addedBy || user.name || 'You',
  };
}

function toRowData(values, user, existingPlace) {
  return {
    ownerId: user.$id,
    name: values.name,
    province: values.province,
    price: Number(values.price),
    rating: Number(values.rating),
    category: values.category,
    notes: values.notes || '',
    image: values.image || '',
    isFavorite: values.isFavorite === undefined
      ? Boolean(existingPlace && existingPlace.isFavorite)
      : Boolean(values.isFavorite),
    collection: values.collection || 'Only my journal',
    addedBy: (existingPlace && existingPlace.addedBy) || user.name || 'You',
  };
}

async function loadCloudPlaces(user) {
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tableId,
    queries: [
      Query.equal('ownerId', [user.$id]),
      Query.limit(100),
    ],
    total: false,
  });
  return result.rows
    .sort((left, right) => Date.parse(right.$createdAt) - Date.parse(left.$createdAt))
    .map((row) => toPlace(row, user));
}

function getPrivateRowPermissions(userId) {
  const userRole = Role.user(userId);
  return [
    Permission.read(userRole),
    Permission.update(userRole),
    Permission.delete(userRole),
  ];
}

export function AppProvider({ children }) {
  const [places, setPlaces] = useState(SEED_PLACES);
  const [profile, setProfile] = useState(null);
  const [compactPhotoMode, setCompactPhotoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const guestPlaces = useRef(SEED_PLACES);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          if (!data || !Array.isArray(data.places)) {
            throw new Error('Saved guest journal has an unexpected format.');
          }
          guestPlaces.current = data.places;
          if (active) {
            setPlaces(data.places);
            setCompactPhotoMode(Boolean(data.compactPhotoMode));
          }
        }

        if (isAppwriteConfigured) {
          let currentUser = null;
          try {
            currentUser = await account.get();
          } catch (error) {
            if (!isNoActiveSession(error)) throw error;
          }

          if (currentUser) {
            const cloudPlaces = await loadCloudPlaces(currentUser);
            if (active) {
              setProfile(currentUser);
              setPlaces(cloudPlaces);
            }
          }
        }
      } catch (error) {
        console.error('Unable to initialize the journal:', error);
        Alert.alert(
          'App startup issue',
          `Could not load saved journal data. ${error.message || 'Check your connection and Appwrite setup.'}`,
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ places: guestPlaces.current, compactPhotoMode }),
    ).catch((error) => {
      console.error('Unable to save the guest journal:', error);
      Alert.alert('Could not save changes', 'Your guest journal may not be available after closing the app.');
    });
  }, [places, profile, compactPhotoMode, isLoading]);

  const updateGuestPlaces = (updater) => {
    setPlaces((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      guestPlaces.current = next;
      return next;
    });
  };

  const signIn = async ({ email, password }) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Copy .env.example to .env and enter your project IDs.');
    }

    await account.createEmailPasswordSession({ email, password });
    try {
      const user = await account.get();
      const cloudPlaces = await loadCloudPlaces(user);
      setProfile(user);
      setPlaces(cloudPlaces);
      return user;
    } catch (error) {
      try {
        await account.deleteSession({ sessionId: 'current' });
      } catch (cleanupError) {
        console.error('Could not clear the incomplete Appwrite session:', cleanupError);
      }
      throw error;
    }
  };

  const signUp = async ({ name, email, password }) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Copy .env.example to .env and enter your project IDs.');
    }
    await account.create({ userId: ID.unique(), email, password, name });
    return signIn({ email, password });
  };

  const signOut = async () => {
    await account.deleteSession({ sessionId: 'current' });
    setProfile(null);
    setPlaces(guestPlaces.current);
  };

  const sendPasswordRecovery = async (email) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Set up the project before requesting password recovery.');
    }
    return account.createRecoveryOTP({ email });
  };

  const resetPassword = async ({ userId, code, password }) => {
    await account.updateRecoveryOTP({ userId, secret: code, password });
  };

  const savePlace = async (values, placeId) => {
    if (!profile) {
      if (placeId) {
        updateGuestPlaces((current) => current.map((place) => (
          place.id === placeId ? { ...place, ...values } : place
        )));
        return;
      }
      updateGuestPlaces((current) => [{
        ...values,
        id: `${Date.now()}`,
        isFavorite: false,
        addedBy: 'You',
      }, ...current]);
      return;
    }

    const existing = placeId ? places.find((place) => place.id === placeId) : null;
    const data = toRowData(values, profile, existing);
    const row = placeId
      ? await tablesDB.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tableId,
        rowId: placeId,
        data,
      })
      : await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tableId,
        rowId: ID.unique(),
        data,
        permissions: getPrivateRowPermissions(profile.$id),
      });
    const savedPlace = toPlace(row, profile);
    setPlaces((current) => placeId
      ? current.map((place) => (place.id === placeId ? savedPlace : place))
      : [savedPlace, ...current]);
  };

  const removePlace = async (placeId) => {
    if (profile) {
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tableId,
        rowId: placeId,
      });
      setPlaces((current) => current.filter((place) => place.id !== placeId));
      return;
    }
    updateGuestPlaces((current) => current.filter((place) => place.id !== placeId));
  };

  const toggleFavorite = async (placeId) => {
    const place = places.find((item) => item.id === placeId);
    if (!place) return;
    const isFavorite = !place.isFavorite;
    if (profile) {
      await tablesDB.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tableId,
        rowId: placeId,
        data: { isFavorite },
      });
      setPlaces((current) => current.map((item) => (
        item.id === placeId ? { ...item, isFavorite } : item
      )));
      return;
    }
    updateGuestPlaces((current) => current.map((item) => (
      item.id === placeId ? { ...item, isFavorite } : item
    )));
  };

  const value = useMemo(() => ({
    places,
    profile,
    compactPhotoMode,
    isLoading,
    isAppwriteConfigured,
    signIn,
    signUp,
    signOut,
    sendPasswordRecovery,
    resetPassword,
    setCompactPhotoMode,
    savePlace,
    removePlace,
    toggleFavorite,
  }), [places, profile, compactPhotoMode, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider.');
  return context;
}
