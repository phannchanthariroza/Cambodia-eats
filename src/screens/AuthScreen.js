import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, ScreenTitle, TextField } from '../components/Ui';
import { COLORS } from '../theme';

export default function AuthScreen({
  mode,
  isAppwriteConfigured,
  recoveryDetails,
  onBack,
  onForgotPassword,
  onSignIn,
  onSignUp,
  onRecover,
  onResetPassword,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isForgot = mode === 'forgot';
  const isReset = mode === 'reset';
  const isSignup = mode === 'signup';

  const submit = async () => {
    if (!isAppwriteConfigured) {
      Alert.alert('Appwrite is not configured', 'Follow the Appwrite setup steps in README.md, then restart Expo.');
      return;
    }

    if (isReset) {
      if (!recoveryDetails || !recoveryCode.trim() || !password || !passwordAgain) {
        Alert.alert('Complete the form', 'Enter the recovery code and confirm your new password.');
        return;
      }
      if (!/^\d{6}$/.test(recoveryCode.trim())) {
        Alert.alert('Check the recovery code', 'Enter the 6-digit code from your Appwrite email.');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Password too short', 'Use at least 8 characters.');
        return;
      }
      if (password !== passwordAgain) {
        Alert.alert('Passwords do not match', 'Check both password fields and try again.');
        return;
      }
    } else if (!email.trim() || (!isForgot && !password) || (isSignup && !name.trim())) {
      Alert.alert('Complete the form', isForgot ? 'Enter your email address.' : 'Enter your name, email, and password.');
      return;
    } else if (isSignup && password.length < 8) {
      Alert.alert('Password too short', 'Use at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isReset) {
        await onResetPassword({ ...recoveryDetails, code: recoveryCode.trim(), password });
      } else if (isForgot) {
        await onRecover(email.trim());
      } else if (isSignup) {
        await onSignUp({ name: name.trim(), email: email.trim(), password });
      } else {
        await onSignIn({ email: email.trim(), password });
      }
    } catch (error) {
      console.error('Appwrite authentication request failed:', error);
      Alert.alert('Appwrite request failed', error.message || 'Check your connection and project setup, then try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isReset
    ? 'Choose a new password.'
    : isForgot
      ? 'Forgot your password?'
      : isSignup
        ? 'Start your food story.'
        : 'Welcome back.';
  const subtitle = isReset
    ? 'Enter the 6-digit code from Appwrite and set a new password.'
    : isForgot
      ? 'We will send a 6-digit recovery code to your email.'
      : 'Your places are saved to your Appwrite account.';

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text onPress={onBack} style={styles.back}>
        <Feather name="chevron-left" size={16} color={COLORS.ink} />  Back
      </Text>
      <ScreenTitle
        eyebrow={isAppwriteConfigured ? 'APPWRITE ACCOUNT' : 'APPWRITE SETUP'}
        title={title}
        subtitle={subtitle}
      />

      {!isAppwriteConfigured && (
        <Text style={styles.setupNotice}>
          Add your project values to the local .env file and restart Expo before using account features.
        </Text>
      )}

      {isSignup && (
        <TextField
          label="Your name"
          value={name}
          onChangeText={setName}
          placeholder="How should we call you?"
          autoCapitalize="words"
        />
      )}
      {!isReset && (
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      {isReset && (
        <TextField
          label="6-digit recovery code"
          value={recoveryCode}
          onChangeText={setRecoveryCode}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
        />
      )}
      {!isForgot && (
        <TextField
          label={isReset ? 'New password' : 'Password'}
          value={password}
          onChangeText={setPassword}
          placeholder={isReset ? 'Enter a new password' : 'Enter your password'}
          secureTextEntry
          autoCapitalize="none"
        />
      )}
      {isReset && (
        <TextField
          label="Confirm new password"
          value={passwordAgain}
          onChangeText={setPasswordAgain}
          placeholder="Re-enter your new password"
          secureTextEntry
          autoCapitalize="none"
        />
      )}
      {isSignup && <Text style={styles.helper}>Use at least 8 characters.</Text>}

      <PrimaryButton
        label={isReset
          ? 'Update password'
          : isForgot
            ? 'Send recovery email'
            : isSignup
              ? 'Create account'
              : 'Sign in'}
        onPress={submit}
        loading={isSubmitting}
        disabled={!isAppwriteConfigured}
        style={styles.submit}
      />
      {!isForgot && !isReset && !isSignup && (
        <Text onPress={onForgotPassword} style={styles.forgot}>Forgot password?</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 17 },
  back: { color: COLORS.ink, fontWeight: '700', fontSize: 12, paddingVertical: 5 },
  setupNotice: { color: COLORS.terracottaDark, backgroundColor: COLORS.terracottaLight, fontSize: 12, lineHeight: 18, padding: 12, borderRadius: 14 },
  helper: { color: COLORS.muted, fontSize: 11, marginTop: -10 },
  submit: { marginTop: 4 },
  forgot: { color: COLORS.terracotta, fontSize: 12, fontWeight: '700', textAlign: 'center', padding: 8 },
});
