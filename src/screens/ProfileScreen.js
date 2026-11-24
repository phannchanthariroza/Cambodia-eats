import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, ScreenTitle } from '../components/Ui';
import { COLORS, RADII } from '../theme';

export default function ProfileScreen({
  profile,
  placeCount,
  compactPhotoMode,
  isAppwriteConfigured,
  onBack,
  onToggleCompactMode,
  onSignIn,
  onSignUp,
  onSignOut,
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text onPress={onBack} style={styles.back}>Back to journal</Text>
      <ScreenTitle
        eyebrow="YOUR PROFILE"
        title={profile ? profile.name : 'Food lover'}
        subtitle={profile ? profile.email : 'Keep your favorite discoveries close.'}
      />

      <View style={styles.profileCard}>
        <View style={styles.avatar}><Feather name="user" size={25} color={COLORS.terracotta} /></View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{profile ? profile.name : 'Local journal'}</Text>
          <Text style={styles.profileEmail}>{profile ? profile.email : 'No account connected'}</Text>
        </View>
        <View style={[styles.localBadge, !isAppwriteConfigured && styles.setupBadge]}>
          <Text style={[styles.localBadgeText, !isAppwriteConfigured && styles.setupBadgeText]}>
            {profile ? 'APPWRITE' : isAppwriteConfigured ? 'READY' : 'SETUP NEEDED'}
          </Text>
        </View>
      </View>

      <View style={styles.settings}>
        <Text style={styles.settingsTitle}>Journal settings</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingName}>Saved places</Text>
            <Text style={styles.settingDescription}>Your food discoveries</Text>
          </View>
          <Text style={styles.settingValue}>{placeCount}</Text>
        </View>
        <View style={[styles.settingRow, styles.lastSetting]}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Compact photo mode</Text>
            <Text style={styles.settingDescription}>Hide photos in place lists</Text>
          </View>
          <Switch
            value={compactPhotoMode}
            onValueChange={onToggleCompactMode}
            trackColor={{ false: COLORS.border, true: COLORS.terracotta }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Feather name="info" size={16} color={COLORS.terracotta} />
        <Text style={styles.infoText}>
          {isAppwriteConfigured
            ? 'Sign in to sync your places with Appwrite. Guest sample data and display settings stay on this device.'
            : 'Create your Appwrite project and add its endpoint and IDs to .env. Guest sample data stays on this device until then.'}
        </Text>
      </View>

      {profile ? (
        <PrimaryButton label="Sign out of Appwrite" icon="log-out" variant="secondary" onPress={onSignOut} />
      ) : (
        <View style={styles.authButtons}>
          <PrimaryButton
            label="Sign in to Appwrite"
            icon="log-in"
            onPress={onSignIn}
            style={styles.authButton}
            disabled={!isAppwriteConfigured}
          />
          <PrimaryButton
            label="Create Appwrite account"
            variant="secondary"
            onPress={onSignUp}
            style={styles.authButton}
            disabled={!isAppwriteConfigured}
          />
        </View>
      )}
      <Pressable onPress={onSignIn} style={styles.about}>
        <Text style={styles.aboutText}>Cambodia Eats · Food & Place Journal</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 28 },
  back: { color: COLORS.inkSoft, fontWeight: '700', fontSize: 12, paddingVertical: 5, marginBottom: 12 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.large, marginTop: 20 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.terracottaLight, alignItems: 'center', justifyContent: 'center' },
  profileCopy: { flex: 1 },
  profileName: { color: COLORS.ink, fontSize: 14, fontWeight: '700' },
  profileEmail: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  localBadge: { backgroundColor: COLORS.greenLight, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7 },
  localBadgeText: { color: COLORS.green, fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  setupBadge: { backgroundColor: COLORS.terracottaLight },
  setupBadgeText: { color: COLORS.terracottaDark },
  settings: { marginTop: 20, paddingHorizontal: 14, paddingTop: 15, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.large },
  settingsTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  lastSetting: { borderBottomWidth: 0 },
  settingText: { flex: 1, paddingRight: 10 },
  settingName: { color: COLORS.inkSoft, fontSize: 12, fontWeight: '600' },
  settingDescription: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  settingValue: { color: COLORS.ink, fontWeight: '700', fontSize: 13 },
  infoCard: { flexDirection: 'row', gap: 9, padding: 13, backgroundColor: COLORS.terracottaLight, borderRadius: RADII.medium, marginVertical: 17 },
  infoText: { flex: 1, color: COLORS.terracottaDark, fontSize: 11, lineHeight: 16 },
  authButtons: { gap: 10 },
  authButton: { width: '100%' },
  about: { alignItems: 'center', padding: 18 },
  aboutText: { color: COLORS.muted, fontSize: 10 },
});
