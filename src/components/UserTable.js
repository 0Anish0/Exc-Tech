// UserTable.js
import React from 'react';
import { DataTable } from 'react-native-paper';

export default function UserTable({ users }) {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Email</DataTable.Title>
        <DataTable.Title>Created At</DataTable.Title>
      </DataTable.Header>
      {users.map(user => (
        <DataTable.Row key={user.id}>
          <DataTable.Cell>{user.email}</DataTable.Cell>
          <DataTable.Cell>{new Date(user.created_at).toLocaleString()}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}