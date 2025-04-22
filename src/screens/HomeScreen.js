// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { supabase } from '../api/supabase/client';
import { useAuth } from '../store/AuthContext';
import UserTable from '../components/UserTable';
import LoadingIndicator from '../components/LoadingIndicator';

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Get the current session to retrieve the access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setLoading(false);
        return;
      }
      // Call the Edge Function with the correct name
      const { data, error } = await supabase.functions.invoke('swift-api', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (error) {
        console.error('Edge Function error:', error);
      }
      if (data && data.users) setUsers(data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome{user && user.email ? `, ${user.email}` : ''}!</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>All Registered Users</Text>
          {loading ? <LoadingIndicator /> : <UserTable users={users} />}
        </Card>
        <Button mode="outlined" onPress={signOut} style={styles.button}>
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    paddingTop: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    padding: 24,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#222',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
});