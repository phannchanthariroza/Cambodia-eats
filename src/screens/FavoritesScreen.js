import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import PlaceCard from '../components/PlaceCard';
import { EmptyState, ScreenTitle } from '../components/Ui';
import { COLORS } from '../theme';

export default function FavoritesScreen({ places, compactPhotoMode, onOpenPlace, onToggleFavorite }) {
  const favorites = places.filter((place) => place.isFavorite);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenTitle
        eyebrow="THE KEEPERS"
        title="Your favorites"
        subtitle="For the places you'll come back to."
      />
      <Text style={styles.count}>{favorites.length} saved {favorites.length === 1 ? 'favorite' : 'favorites'}</Text>
      {favorites.length ? favorites.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          compactPhotoMode={compactPhotoMode}
          onPress={() => onOpenPlace(place)}
          onToggleFavorite={() => onToggleFavorite(place.id)}
        />
      )) : (
        <EmptyState
          icon="heart"
          title="No favorites yet"
          message="Tap the heart on a place to keep it close."
        />
      )}
      {favorites.length > 0 && <Text style={styles.footer}>A few favorites. A lot of good memories.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28 },
  count: { color: COLORS.muted, fontSize: 12, marginTop: 18, marginBottom: 10 },
  footer: { color: COLORS.muted, fontSize: 12, textAlign: 'center', marginTop: 5 },
});
