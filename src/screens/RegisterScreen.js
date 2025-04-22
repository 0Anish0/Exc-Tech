// RegisterScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../store/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
    } catch (err) {
      setError(err.message || 'Email already registered');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Card style={{ padding: 16, elevation: 4 }}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Register</Text>
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
        <Button mode="contained" onPress={handleRegister} loading={loading} style={{ marginBottom: 8 }}>
          Register
        </Button>
        <Button onPress={() => navigation.navigate('Login')}>Already have an account? Login</Button>
      </Card>
    </View>
  );
}