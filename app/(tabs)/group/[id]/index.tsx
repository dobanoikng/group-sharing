import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { Group, groupService } from '@/services/GroupServices';
import { Layout, Spinner, Tab, TabView } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Expense from './expense';
import Members from './members';
import Summary from './summary';

export default function DetailGroup() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState<Group>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { loading, call: getDetail } = useServiceLoader(groupService.detail);

  const onGetDetailGroup = async () => {
    try {
      const data = await getDetail(id as string);
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
      <View style={styles.center}>
        <Spinner size="giant" />
      </View>
    );
  if (group)
    return (
      <View style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="Expenses">
            <Layout style={styles.tabContainer}>
              <Expense groupId={id as string} />
            </Layout>
          </Tab>
          <Tab title="Members">
            <Layout style={styles.tabContainer}>
              <Members groupId={id as string} />
            </Layout>
          </Tab>
          <Tab title="Summary">
            <Layout style={styles.tabContainer}>
              <Summary />
            </Layout>
          </Tab>
        </TabView>
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
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
  },
});
