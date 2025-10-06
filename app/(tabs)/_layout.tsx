import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
const Layout = () => {
  const { t } = useTranslation();
  return (
    <Tabs>
      <Tabs.Screen
        name="group"
        options={{
          headerShown: false,
          title: t('tab.group'),
          tabBarIcon: ({ size, color }) => <FontAwesome name="group" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          headerShown: false,
          title: t('tab.user'),
          tabBarIcon: ({ size, color }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
