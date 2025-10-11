import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import ControllerInput from '@/components/form/ControllerInput';
import { supabase } from '@/libs/supabase';

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
      <Text category="h1" style={styles.header}>
        Login
      </Text>
      <View style={styles.form}>
        <ControllerInput<LoginFormData> control={control} name="email" placeholder="Email" />
        <ControllerInput<LoginFormData>
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />
        {error && (
          <Text style={styles.errorText} status="danger">
            {error}
          </Text>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
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
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
  },
});
