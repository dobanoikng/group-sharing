import { Stack } from 'expo-router'
import React from 'react'

const UserLayout = () => {
  return (
    <Stack initialRouteName='list'>
      <Stack.Screen name='list' options={{ title: "Danh sách người dùng" }} />
      <Stack.Screen name='form' />
    </Stack>
  )
}

export default UserLayout
