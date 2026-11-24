import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADII } from '../theme';

export function ScreenTitle({ eyebrow, title, subtitle, right }) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right || null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  style,
  disabled = false,
  loading = false,
}) {
  const secondary = variant === 'secondary';
  const danger = variant === 'danger';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        danger && styles.dangerButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={secondary ? COLORS.terracotta : COLORS.white} />
        : (
          <>
            {icon ? <Feather name={icon} size={16} color={secondary ? COLORS.terracotta : COLORS.white} /> : null}
            <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{label}</Text>
          </>
        )}
    </Pressable>
  );
}

export function TextField({ label, style, inputStyle, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={COLORS.muted}
        style={[styles.input, inputStyle]}
        {...inputProps}
      />
    </View>
  );
}

export function Chip({ label, selected, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip, style]}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({ icon = 'map', title, message, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={22} color={COLORS.terracotta} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
      {action || null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  titleCopy: { flex: 1 },
  eyebrow: { color: COLORS.terracotta, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 5 },
  title: { color: COLORS.ink, fontSize: 27, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  button: {
    minHeight: 48,
    backgroundColor: COLORS.terracotta,
    borderRadius: RADII.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  secondaryButton: { backgroundColor: COLORS.terracottaLight, borderWidth: 1, borderColor: COLORS.border },
  dangerButton: { backgroundColor: COLORS.danger },
  disabledButton: { opacity: 0.55 },
  pressed: { opacity: 0.8 },
  buttonText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  secondaryButtonText: { color: COLORS.terracottaDark },
  field: { gap: 7 },
  fieldLabel: { color: COLORS.inkSoft, fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.ink,
    fontSize: 14,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: COLORS.sand,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedChip: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText: { color: COLORS.inkSoft, fontSize: 12, fontWeight: '600' },
  selectedChipText: { color: COLORS.white },
  empty: { alignItems: 'center', paddingHorizontal: 28, paddingVertical: 42, gap: 10 },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.terracottaLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: COLORS.ink, fontWeight: '700', fontSize: 17, textAlign: 'center' },
  emptyMessage: { color: COLORS.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
