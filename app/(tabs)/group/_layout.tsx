import { Stack } from 'expo-router';
import { t } from 'i18next';
import React from 'react';

const UserLayout = () => {
  return (
    <Stack initialRouteName="list">
      <Stack.Screen name="list" options={{ title: 'Danh sách nhóm' }} />
      <Stack.Screen name="create" options={{ title: 'Tạo mới' }} />
      <Stack.Screen name="[id]" options={{ title: t('group.detail-title') }} />
    </Stack>
  );
};

export default UserLayout;
