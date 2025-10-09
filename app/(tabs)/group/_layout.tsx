import { Stack } from 'expo-router';
import { t } from 'i18next';
import React from 'react';

const UserLayout = () => {
  return (
    <Stack initialRouteName="list">
      <Stack.Screen name="list" options={{ title: t('group.list-title') }} />
      <Stack.Screen name="[id]/index" options={{ title: t('group.detail-title') }} />
    </Stack>
  );
};

export default UserLayout;
