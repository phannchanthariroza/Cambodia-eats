import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PlaceCard from '../components/PlaceCard';
import { PrimaryButton, ScreenTitle, TextField } from '../components/Ui';
import { COLORS, RADII } from '../theme';

export default function TogetherScreen({
  places,
  compactPhotoMode,
  profile,
  onOpenPlace,
  onAddPlace,
  onShare,
  onToggleFavorite,
}) {
  const [inviteEmail, setInviteEmail] = useState('');
  const sharedPlaces = places.filter((place) => place.collection !== 'Only my journal');
  const previewPhotos = sharedPlaces.filter((place) => place.image).slice(0, 2);

  const invite = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      Alert.alert('Check the email', 'Enter a valid email address to prepare an invitation.');
      return;
    }
    Alert.alert(
      'Demo invitation',
      `The invite for ${inviteEmail.trim()} was not sent. Connect an account service to enable real invitations.`,
    );
    setInviteEmail('');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenTitle
        eyebrow="TOGETHER / SHARED COLLECTION"
        title="Our Siem Reap Trip"
        subtitle={`${sharedPlaces.length} ${sharedPlaces.length === 1 ? 'place' : 'places'} · ${profile ? 'Private to your Appwrite account' : 'Local preview'}`}
        right={(
          <Pressable onPress={onShare} style={styles.shareButton} accessibilityLabel="Share collection">
            <Feather name="share-2" size={17} color={COLORS.ink} />
          </Pressable>
        )}
      />

      {!compactPhotoMode && previewPhotos.length > 0 && (
        <View style={styles.previewRow}>
          {previewPhotos.map((place) => (
            <Image key={place.id} source={{ uri: place.image }} style={styles.previewImage} />
          ))}
          {previewPhotos.length === 1 && <View style={styles.previewPlaceholder}><Feather name="coffee" size={22} color={COLORS.terracotta} /></View>}
        </View>
      )}

      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>The table is better with friends.</Text>
        <View style={styles.memberRow}>
          <View style={[styles.member, styles.owner]}>
            <Text style={[styles.memberText, styles.ownerText]}>
              {profile ? `${profile.name} · Owner` : 'Sign in to sync this journal'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.inviteCard}>
        <TextField
          label="Invite a friend"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          placeholder="friend@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PrimaryButton label="Prepare invite" icon="mail" onPress={invite} style={styles.inviteButton} />
        <Text style={styles.demoNote}>Invitations are a demo only; no email is sent.</Text>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Places we've saved</Text>
        <Text style={styles.placeCount}>{sharedPlaces.length}</Text>
      </View>
      {sharedPlaces.length > 0 ? sharedPlaces.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          compactPhotoMode={compactPhotoMode}
          onPress={() => onOpenPlace(place)}
          onToggleFavorite={() => onToggleFavorite(place.id)}
        />
      )) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Add a place to start your collection.</Text>
        </View>
      )}
      <PrimaryButton label="Add a place to this collection" icon="plus" onPress={onAddPlace} />
      <Text style={styles.footer}>
        Place records sync to Appwrite when signed in. Invitations and multi-user collections are not connected yet.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28 },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.sand, alignItems: 'center', justifyContent: 'center' },
  previewRow: { flexDirection: 'row', gap: 9, marginTop: 17 },
  previewImage: { flex: 1, height: 118, borderRadius: RADII.medium, backgroundColor: COLORS.sand },
  previewPlaceholder: { flex: 1, height: 118, borderRadius: RADII.medium, backgroundColor: COLORS.terracottaLight, alignItems: 'center', justifyContent: 'center' },
  groupCard: { marginTop: 18 },
  groupTitle: { color: COLORS.ink, fontWeight: '700', fontSize: 16, marginBottom: 12 },
  memberRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  member: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: COLORS.sand },
  owner: { backgroundColor: COLORS.terracottaLight },
  memberText: { color: COLORS.inkSoft, fontSize: 11, fontWeight: '600' },
  ownerText: { color: COLORS.terracottaDark },
  inviteCard: { marginTop: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.large, padding: 14 },
  inviteButton: { marginTop: 11 },
  demoNote: { color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 8 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12 },
  sectionTitle: { color: COLORS.ink, fontWeight: '700', fontSize: 16 },
  placeCount: { color: COLORS.muted, fontSize: 12 },
  empty: { padding: 18, borderRadius: RADII.medium, backgroundColor: COLORS.white, marginBottom: 14 },
  emptyText: { color: COLORS.muted, textAlign: 'center', fontSize: 13 },
  footer: { color: COLORS.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 12 },
});
