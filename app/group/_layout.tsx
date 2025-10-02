import { Stack } from 'expo-router';
import React from 'react';

export default function GroupLayout() {
  return <Stack>
    <Stack.Screen name="create" options={{ title: "Create Group" }} />
    <Stack.Screen name="[id]" options={{ title: "Chi tiết nhóm" }} />
  </Stack>;
}


