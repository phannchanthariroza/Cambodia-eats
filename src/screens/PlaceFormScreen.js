import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { Chip, PrimaryButton, ScreenTitle, TextField } from '../components/Ui';
import { COLORS, RADII } from '../theme';

const PROVINCES = ['Siem Reap', 'Kampot', 'Phnom Penh'];
const CATEGORIES = ['Street food', 'Café', 'Restaurant', 'Dessert', 'Other'];
const COLLECTIONS = ['Our Siem Reap Trip', 'Only my journal'];

export default function PlaceFormScreen({ place, onBack, onSave }) {
  const [name, setName] = useState(place ? place.name : '');
  const [province, setProvince] = useState(place ? place.province : PROVINCES[0]);
  const [price, setPrice] = useState(place ? String(place.price) : '2.50');
  const [rating, setRating] = useState(place ? Number(place.rating) : 5);
  const [category, setCategory] = useState(place ? place.category : CATEGORIES[0]);
  const [notes, setNotes] = useState(place ? place.notes : '');
  const [collection, setCollection] = useState(place ? (place.collection || COLLECTIONS[1]) : COLLECTIONS[0]);
  const [image, setImage] = useState(place ? place.image : '');
  const [saving, setSaving] = useState(false);

  const selectImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Photo access needed', 'Allow photo access in your device settings to choose a place photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Unable to choose a photo:', error);
      Alert.alert('Could not open photos', 'Please try again.');
    }
  };

  const submit = async () => {
    const cleanName = name.trim();
    const parsedPrice = Number(price);
    if (!cleanName) {
      Alert.alert('Place name required', 'Enter a name for this place.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Check the price', 'Enter a valid price of zero or more.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: cleanName,
        province,
        price: parsedPrice,
        rating,
        category,
        notes: notes.trim(),
        collection,
        image,
      });
    } catch (error) {
      console.error('Unable to save place:', error);
      Alert.alert('Could not save this place', error.message || 'Check your connection and Appwrite permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <ScreenTitle
            eyebrow="YOUR JOURNAL"
            title={place ? 'Edit your find' : 'Add a good find'}
          />
          <Text onPress={onBack} style={styles.cancel}>Cancel</Text>
        </View>

        <Pressable onPress={selectImage} style={styles.photoButton}>
          {image ? (
            <Image source={{ uri: image }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={22} color={COLORS.terracotta} />
              <Text style={styles.photoText}>Add a photo (optional)</Text>
            </View>
          )}
          {image ? (
            <View style={styles.changePhoto}>
              <Feather name="camera" size={14} color={COLORS.ink} />
              <Text style={styles.changePhotoText}>Change photo</Text>
            </View>
          ) : null}
        </Pressable>

        <TextField label="Place name" value={name} onChangeText={setName} placeholder="e.g. Courtyard coffee" returnKeyType="next" maxLength={128} />

        <Text style={styles.label}>Province</Text>
        <View style={styles.chips}>
          {PROVINCES.map((item) => (
            <Chip key={item} label={item} selected={province === item} onPress={() => setProvince(item)} />
          ))}
        </View>

        <TextField
          label="Price per person ($)"
          value={price}
          onChangeText={setPrice}
          placeholder="2.50"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>

        <Text style={styles.label}>Your rating</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              accessibilityRole="button"
              accessibilityLabel={`${star} star${star === 1 ? '' : 's'}`}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Feather
                name="star"
                size={27}
                color={star <= rating ? COLORS.terracotta : COLORS.border}
                fill={star <= rating ? COLORS.terracotta : 'transparent'}
              />
            </Pressable>
          ))}
          <Text style={styles.ratingValue}>{rating} / 5</Text>
        </View>

        <TextField
          label="Your notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes for next time..."
          multiline
          numberOfLines={4}
          maxLength={2000}
          inputStyle={styles.notesInput}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Save to collection</Text>
        <View style={styles.chips}>
          {COLLECTIONS.map((item) => (
            <Chip key={item} label={item} selected={collection === item} onPress={() => setCollection(item)} />
          ))}
        </View>

        <PrimaryButton
          label={place ? 'Save changes' : 'Save place'}
          icon="check"
          onPress={submit}
          loading={saving}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 18, paddingBottom: 32, gap: 17 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cancel: { color: COLORS.muted, fontWeight: '600', fontSize: 12, padding: 8 },
  photoButton: { height: 155, borderRadius: RADII.medium, backgroundColor: COLORS.terracottaLight, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoText: { color: COLORS.terracottaDark, fontWeight: '700', fontSize: 12 },
  changePhoto: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7 },
  changePhotoText: { color: COLORS.ink, fontSize: 11, fontWeight: '700' },
  label: { color: COLORS.inkSoft, fontSize: 12, fontWeight: '700', marginBottom: -8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starButton: { padding: 3 },
  ratingValue: { color: COLORS.muted, fontSize: 11, fontWeight: '700', marginLeft: 6 },
  notesInput: { minHeight: 95 },
  saveButton: { marginTop: 3 },
});
