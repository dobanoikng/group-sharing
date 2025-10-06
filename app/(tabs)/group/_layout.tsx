import { Stack } from 'expo-router';
import React from 'react';

const UserLayout = () => {
  return (
    <Stack initialRouteName="list">
      <Stack.Screen name="list" options={{ title: 'Danh sách nhóm' }} />
      <Stack.Screen name="create" options={{ title: 'Tạo mới' }} />
    </Stack>
  );
};

export default UserLayout;
