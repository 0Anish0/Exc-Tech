// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { supabase } from '../api/supabase/client';
import { useAuth } from '../store/AuthContext';
import UserTable from '../components/UserTable';
import LoadingIndicator from '../components/LoadingIndicator';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('id, email, created_at');
      if (!error) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <Card style={{ padding: 16, marginBottom: 16, elevation: 4 }}>
        <Text variant="titleLarge" style={{ marginBottom: 8 }}>All Registered Users</Text>
        {loading ? <LoadingIndicator /> : <UserTable users={users} />}
      </Card>
      <Button mode="outlined" onPress={signOut}>Logout</Button>
    </ScrollView>
  );
}