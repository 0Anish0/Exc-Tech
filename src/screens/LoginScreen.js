// LoginScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../store/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Card style={{ padding: 16, elevation: 4 }}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Login</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ marginBottom: 8 }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: 8 }}
        />
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <Button mode="contained" onPress={handleLogin} loading={loading} style={{ marginBottom: 8 }}>
          Login
        </Button>
        <Button onPress={() => navigation.navigate('Register')}>Don't have an account? Register</Button>
      </Card>
    </View>
  );
}