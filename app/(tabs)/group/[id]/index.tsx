import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { Group, groupService } from '@/services/GroupServices';
import { Layout, Spinner, Tab, TabView } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Expense from './expense';
import Members from './members';
import Summary from './summary';

type GroupState = Group & {
  expenses: {
    amount: number;
    title: string;
    paid_by: string;
    expense_splits: {
      amount: number;
      user_id: string;
    }[];
  }[];
};

export default function DetailGroup() {
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  const [group, setGroup] = useState<GroupState>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { loading, call: getDetail } = useServiceLoader(groupService.detail);

  const onGetDetailGroup = async () => {
    try {
      const data = await getDetail(id as string);
      setGroup(data);
    } catch (error: any) {
      if (error?.message) showToast(error.message, { type: 'error' });
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
          <Tab title={t('expenses')}>
            <Layout style={styles.tabContainer}>
              <Expense groupId={id as string} />
            </Layout>
          </Tab>
          <Tab title={t('member')}>
            <Layout style={styles.tabContainer}>
              <Members groupId={id as string} />
            </Layout>
          </Tab>
          <Tab title={t('summary')}>
            <Layout style={styles.tabContainer}>
              <Summary group={group} />
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
