import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { z } from 'zod';

import ControllerInput from '@/components/form/ControllerInput';
import { supabase } from '@/libs/supabase';
import { t } from 'i18next';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        // The onAuthStateChange listener in AuthContext will handle the redirect
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Svg fill="none" stroke="white" viewBox="0 0 24 24">
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </Svg>
        </View>
        <Text category="h1">{t('login-form.title')}</Text>
        <Text category="p1">{t('login-form.hint')}</Text>
      </View>
      <View style={styles.form}>
        <ControllerInput<LoginFormData>
          control={control}
          name="email"
          placeholder={t('login-form.email')}
          label={t('login-form.email')}
          required
        />
        <ControllerInput<LoginFormData>
          control={control}
          name="password"
          placeholder={t('login-form.password-placeholder')}
          secureTextEntry
          label={t('login-form.password')}
          required
        />
        {error && (
          <Text style={styles.errorText} status="danger">
            {error}
          </Text>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? 'Loading...' : t('login-form.button')}
        </Button>

        <Divider />

        <Text style={styles.signup} appearance="hint">
          {t('login-form.dont-have-acc')} <Text>{t('login-form.signup')}</Text>
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    gap: 10,
  },
  form: {
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  signup: {
    textAlign: 'center',
  },
});
