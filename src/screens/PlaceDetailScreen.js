import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, ScreenTitle } from '../components/Ui';
import { COLORS, RADII } from '../theme';

export default function PlaceDetailScreen({
  place,
  compactPhotoMode,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShare,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-left" size={18} color={COLORS.ink} />
          <Text style={styles.backText}>Your saved places</Text>
        </Pressable>
        <Pressable onPress={onShare} style={styles.shareButton} accessibilityLabel="Share collection">
          <Feather name="share-2" size={17} color={COLORS.ink} />
        </Pressable>
      </View>

      {!compactPhotoMode && (
        <View style={styles.hero}>
          {place.image && !imageFailed ? (
            <Image source={{ uri: place.image }} style={styles.heroImage} onError={() => setImageFailed(true)} />
          ) : (
            <View style={styles.heroFallback}><Feather name="coffee" size={34} color={COLORS.terracotta} /></View>
          )}
          <Pressable onPress={onToggleFavorite} style={styles.favorite} accessibilityLabel="Toggle favorite">
            <Feather
              name="heart"
              size={18}
              color={place.isFavorite ? COLORS.terracotta : COLORS.inkSoft}
              fill={place.isFavorite ? COLORS.terracotta : 'transparent'}
            />
          </Pressable>
        </View>
      )}

      <ScreenTitle title={place.name} />
      <Text style={styles.meta}>{place.province}  ·  {place.category}  ·  ${Number(place.price || 0).toFixed(2)} per person</Text>

      <View style={styles.ratingCard}>
        <Feather name="star" size={17} color={COLORS.terracotta} fill={COLORS.terracotta} />
        <Text style={styles.ratingNumber}>{Number(place.rating || 0).toFixed(1)}</Text>
        <Text style={styles.ratingCaption}>Your rating</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>A note for next time</Text>
        <Text style={styles.notes}>{place.notes || 'No notes yet.'}</Text>
      </View>

      <View style={styles.collectionCard}>
        <View>
          <Text style={styles.collectionLabel}>SAVED TO COLLECTION</Text>
          <Text style={styles.collectionName}>{place.collection || 'Only my journal'}</Text>
        </View>
        <Feather name="bookmark" size={17} color={COLORS.terracotta} />
      </View>
      <Text style={styles.savedBy}>Added by {place.addedBy || 'You'} · Stored on this device</Text>

      <PrimaryButton label="Edit place" icon="edit-2" onPress={onEdit} style={styles.action} />
      <PrimaryButton label="Delete place" icon="trash-2" variant="secondary" onPress={onDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6 },
  backText: { color: COLORS.ink, fontSize: 12, fontWeight: '700' },
  shareButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.sand, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 220, borderRadius: RADII.large, overflow: 'hidden', backgroundColor: COLORS.terracottaLight, marginBottom: 18 },
  heroImage: { width: '100%', height: '100%' },
  heroFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  favorite: { position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  meta: { color: COLORS.muted, fontSize: 12, marginTop: 6 },
  ratingCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.sand, borderRadius: RADII.medium, padding: 13, marginTop: 18 },
  ratingNumber: { color: COLORS.ink, fontWeight: '800', fontSize: 15 },
  ratingCaption: { color: COLORS.muted, fontSize: 12 },
  section: { marginTop: 22 },
  sectionTitle: { color: COLORS.ink, fontWeight: '700', fontSize: 15 },
  notes: { color: COLORS.inkSoft, fontSize: 13, lineHeight: 20, marginTop: 7 },
  collectionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.medium, padding: 14, marginTop: 20 },
  collectionLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  collectionName: { color: COLORS.ink, fontWeight: '700', fontSize: 13, marginTop: 5 },
  savedBy: { color: COLORS.muted, fontSize: 10, marginTop: 8, marginBottom: 15 },
  action: { marginBottom: 10 },
});
