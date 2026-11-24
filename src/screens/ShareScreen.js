import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, ScreenTitle } from '../components/Ui';
import { COLORS, RADII } from '../theme';

export default function ShareScreen({ places, onBack }) {
  const [copying, setCopying] = useState(false);
  const sharedPlaces = places.filter((place) => place.collection !== 'Only my journal');
  const shareText = useMemo(() => {
    const list = sharedPlaces.map((place, index) => (
      `${index + 1}. ${place.name} · $${Number(place.price || 0).toFixed(2)}`
    )).join('\n');
    return `Our Siem Reap Trip\nA few places worth finding again:\n\n${list || 'No places saved yet.'}\n\nCambodia · Saved with Cambodia Eats`;
  }, [sharedPlaces]);

  const copyText = async () => {
    try {
      setCopying(true);
      await Clipboard.setStringAsync(shareText);
      Alert.alert('Copied', 'Your collection text is ready to share.');
    } catch (error) {
      console.error('Unable to copy the collection:', error);
      Alert.alert('Could not copy', 'Please try again.');
    } finally {
      setCopying(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text onPress={onBack} style={styles.back}><Feather name="chevron-left" size={16} color={COLORS.ink} />  Back to collection</Text>
      <ScreenTitle
        eyebrow="SHARE YOUR FINDS"
        title="Good finds travel."
        subtitle="Send your list to anyone, even if they don't have Cambodia Eats."
      />

      <View style={styles.notice}>
        <Feather name="lock" size={17} color={COLORS.ink} />
        <Text style={styles.noticeText}>Read-only list. Your journal stays yours.</Text>
      </View>

      <Text style={styles.eyebrow}>SHARE AS TEXT</Text>
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Our Siem Reap Trip</Text>
        <Text style={styles.previewIntro}>A few places worth finding again:</Text>
        {sharedPlaces.length > 0 ? sharedPlaces.map((place, index) => (
          <Text key={place.id} style={styles.placeLine}>
            {index + 1}. {place.name} · ${Number(place.price || 0).toFixed(2)}
          </Text>
        )) : <Text style={styles.placeLine}>No places saved yet.</Text>}
        <Text style={styles.previewFooter}>Cambodia · Saved with Cambodia Eats</Text>
      </View>
      <PrimaryButton label="Copy collection text" icon="copy" onPress={copyText} loading={copying} />

      <Text style={[styles.eyebrow, styles.linkEyebrow]}>SHARE AS A LINK</Text>
      <View style={styles.linkCard}>
        <Feather name="link" size={16} color={COLORS.muted} />
        <Text style={styles.linkText}>A public link requires a backend.</Text>
      </View>
      <Text style={styles.note}>This local demo doesn't publish the collection or create a working link.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28 },
  back: { color: COLORS.ink, fontWeight: '700', fontSize: 12, marginBottom: 18, paddingVertical: 4 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: COLORS.sand, padding: 13, borderRadius: RADII.medium, marginVertical: 18 },
  noticeText: { color: COLORS.ink, fontSize: 12, fontWeight: '700' },
  eyebrow: { color: COLORS.terracotta, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 9 },
  preview: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.large, padding: 17, marginBottom: 13 },
  previewTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '700' },
  previewIntro: { color: COLORS.muted, fontSize: 12, marginTop: 7, marginBottom: 10 },
  placeLine: { color: COLORS.inkSoft, fontSize: 12, lineHeight: 21 },
  previewFooter: { color: COLORS.muted, fontSize: 10, marginTop: 12 },
  linkEyebrow: { marginTop: 25 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.medium, padding: 14 },
  linkText: { color: COLORS.inkSoft, fontSize: 12 },
  note: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 8, textAlign: 'center' },
});
