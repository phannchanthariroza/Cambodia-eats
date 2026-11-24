import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADII } from '../theme';

export default function PlaceCard({
  place,
  compactPhotoMode = false,
  onPress,
  onToggleFavorite,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = place.image && !imageFailed && !compactPhotoMode;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {!compactPhotoMode && (
        <View style={styles.imageWrap}>
          {hasImage ? (
            <Image source={{ uri: place.image }} style={styles.image} onError={() => setImageFailed(true)} />
          ) : (
            <View style={styles.imageFallback}>
              <Feather name="coffee" size={24} color={COLORS.terracotta} />
              <Text style={styles.fallbackText}>A good find</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category || 'Place'}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={place.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            style={styles.favoriteButton}
          >
            <Feather
              name="heart"
              size={17}
              color={place.isFavorite ? COLORS.terracotta : COLORS.inkSoft}
              fill={place.isFavorite ? COLORS.terracotta : 'transparent'}
            />
          </Pressable>
        </View>
      )}
      <View style={styles.copy}>
        <View style={styles.heading}>
          <Text numberOfLines={1} style={styles.name}>{place.name}</Text>
          <View style={styles.rating}>
            <Feather name="star" size={13} color={COLORS.terracotta} fill={COLORS.terracotta} />
            <Text style={styles.ratingText}>{Number(place.rating || 0).toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.meta}>{place.province}  ·  ${Number(place.price || 0).toFixed(2)}</Text>
        {place.notes ? <Text numberOfLines={2} style={styles.notes}>{place.notes}</Text> : null}
        {compactPhotoMode && (
          <Pressable
            accessibilityRole="button"
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            style={styles.compactFavorite}
          >
            <Feather
              name="heart"
              size={17}
              color={place.isFavorite ? COLORS.terracotta : COLORS.muted}
              fill={place.isFavorite ? COLORS.terracotta : 'transparent'}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.large,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#30251E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: { opacity: 0.88 },
  imageWrap: { height: 174, borderRadius: RADII.medium, overflow: 'hidden', backgroundColor: COLORS.sand },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: COLORS.terracottaLight },
  fallbackText: { fontSize: 11, color: COLORS.terracottaDark, fontWeight: '600' },
  categoryBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: COLORS.paper,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: { color: COLORS.ink, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { paddingHorizontal: 3, paddingTop: 10, paddingBottom: 3 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { flex: 1, color: COLORS.ink, fontSize: 18, fontWeight: '700' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: COLORS.terracotta, fontWeight: '700', fontSize: 12 },
  meta: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  notes: { color: COLORS.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 8 },
  compactFavorite: { position: 'absolute', right: 2, top: 2, padding: 3 },
});
