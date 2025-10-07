import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { Group, groupService } from '@/services/GroupServices';
import { Spinner } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailGroup() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState<Group>();
  const { loading, call: getDetail } = useServiceLoader(groupService.detail);

  const onGetDetailGroup = async () => {
    try {
      const data = await getDetail(id as string);
      console.log(data);

      setGroup(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (id) {
      onGetDetailGroup();
    }
  }, [id]);

  if (loading)
    return (
      <View style={styles.container}>
        <Spinner size="giant" />
      </View>
    );
  if (group)
    return (
      <View style={styles.container}>
        <Text>{group.name}</Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <Text>Not Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
