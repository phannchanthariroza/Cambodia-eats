import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PlaceCard from '../components/PlaceCard';
import { Chip, ScreenTitle } from '../components/Ui';
import { COLORS, RADII } from '../theme';

const PROVINCES = ['All', 'Siem Reap', 'Kampot', 'Phnom Penh'];
const PRICE_FILTERS = ['Any price', 'Under $5', '$5–$15', '$15+'];

export default function JournalScreen({
  places,
  compactPhotoMode,
  onOpenPlace,
  onToggleFavorite,
}) {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('All');
  const [priceFilter, setPriceFilter] = useState('Any price');

  const filteredPlaces = useMemo(() => places.filter((place) => {
    const search = query.trim().toLowerCase();
    const matchesSearch = !search
      || place.name.toLowerCase().includes(search)
      || (place.notes || '').toLowerCase().includes(search)
      || place.province.toLowerCase().includes(search);
    const matchesProvince = province === 'All' || place.province === province;
    const price = Number(place.price || 0);
    const matchesPrice = priceFilter === 'Any price'
      || (priceFilter === 'Under $5' && price < 5)
      || (priceFilter === '$5–$15' && price >= 5 && price <= 15)
      || (priceFilter === '$15+' && price > 15);
    return matchesSearch && matchesProvince && matchesPrice;
  }), [places, query, province, priceFilter]);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenTitle
        eyebrow="CAMBODIA EATS"
        title="Your food journal"
        subtitle="Good places deserve a second visit."
      />

      <View style={styles.searchWrap}>
        <Feather name="search" size={17} color={COLORS.muted} />
        <TextInput
          accessibilityLabel="Search saved places"
          value={query}
          onChangeText={setQuery}
          placeholder="Search your saved places"
          placeholderTextColor={COLORS.muted}
          style={styles.search}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Text onPress={() => setQuery('')} style={styles.clearSearch}>Clear</Text>
        )}
      </View>

      <Text style={styles.filterHeading}>PROVINCE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PROVINCES.map((item) => (
          <Chip key={item} label={item === 'All' ? 'All provinces' : item} selected={province === item} onPress={() => setProvince(item)} />
        ))}
      </ScrollView>

      <Text style={styles.filterHeading}>PRICE PER PERSON</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PRICE_FILTERS.map((item) => (
          <Chip key={item} label={item} selected={priceFilter === item} onPress={() => setPriceFilter(item)} />
        ))}
      </ScrollView>

      <View style={styles.listHeading}>
        <Text style={styles.count}>{filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}</Text>
        <Text style={styles.sortLabel}>Newest first</Text>
      </View>
      {filteredPlaces.length ? filteredPlaces.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          compactPhotoMode={compactPhotoMode}
          onPress={() => onOpenPlace(place)}
          onToggleFavorite={() => onToggleFavorite(place.id)}
        />
      )) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsTitle}>No places found</Text>
          <Text style={styles.noResultsCopy}>Try another search or loosen your filters.</Text>
        </View>
      )}
      <Text style={styles.footer}>A journal of your own discoveries.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 26 },
  searchWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    paddingHorizontal: 13,
    marginTop: 18,
  },
  search: { flex: 1, color: COLORS.ink, fontSize: 13, paddingVertical: 11 },
  clearSearch: { color: COLORS.terracotta, fontSize: 12, fontWeight: '700', padding: 5 },
  filterHeading: { color: COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginTop: 18, marginBottom: 8 },
  chips: { gap: 7, paddingRight: 12 },
  listHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 19, marginBottom: 10 },
  count: { color: COLORS.ink, fontWeight: '700', fontSize: 13 },
  sortLabel: { color: COLORS.muted, fontSize: 11 },
  noResults: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: COLORS.white,
    borderRadius: RADII.large,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noResultsTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '700' },
  noResultsCopy: { color: COLORS.muted, textAlign: 'center', fontSize: 12, marginTop: 6 },
  footer: { color: COLORS.muted, fontSize: 12, textAlign: 'center', marginTop: 10 },
});
