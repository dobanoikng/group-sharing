import ModalAddGroup from '@/components/modals/AddGroup';
import FloatingButton from '@/components/ui/FloatingButton';
import StringAvatar from '@/components/ui/StringAvatar';
import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { Group, groupService } from '@/services/GroupServices';
import { formatDate, formatMoney } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, List, Spinner, Text, useTheme } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  profiles: {
    full_name: string;
  };
};
type GroupList = Group & {
  group_members: GroupMember[];
  expenses: { amount: number }[];
};

export default function ListGroup() {
  const router = useRouter();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [groups, setGroups] = useState<GroupList[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const { loading: gettingAll, call: getAllGroup } = useServiceLoader(groupService.getAll);

  const onGetListGroup = async () => {
    try {
      const data = await getAllGroup();
      setGroups(data);
      setRefreshing(false);
    } catch (error: any) {
      if (error?.message) showToast(error.message, { type: 'error' });
    }
  };

  const renderItem = ({ index, item }: { index: number; item: GroupList }) => (
    <Card
      style={{
        marginBottom: index === groups.length - 1 ? 70 : 6,
        borderRadius: 8,

        borderColor: theme['color-info-600'],
      }}
      onPress={() => router.navigate(`/(tabs)/group/${item.id}`)}
    >
      <View>
        <View style={styles.rowCenter}>
          <Text category="h6">{item.name}</Text>
          <MaterialIcons name="arrow-forward" size={24} />
        </View>
        <View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <MaterialIcons name="people-alt" size={20} />
            <Text>
              {item.group_members.length} {t('member')}
            </Text>
          </View>
          <Text category="c2" appearance="hint">
            Ngày tạo: {formatDate(item.created_at)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
          }}
        >
          <View style={styles.memberList}>
            {item.group_members.slice(0, 3).map((grMember, index) => (
              <View key={grMember.user_id} style={{ left: index * -10, zIndex: index }}>
                <StringAvatar text={grMember.profiles.full_name} />
              </View>
            ))}
            {item.group_members.length > 3 && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#eeeaeaff',
                  left: -30,
                  zIndex: 4,
                }}
              >
                <Text
                  style={{
                    color: 'green',
                  }}
                >
                  +{item.group_members.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text appearance="hint">
            {formatMoney(item.expenses.reduce((acc, curr) => acc + curr.amount, 0))}
          </Text>
        </View>
      </View>
    </Card>
  );

  const onRefresh = () => {
    setRefreshing(true);
    onGetListGroup();
  };

  useEffect(() => {
    onGetListGroup();
  }, []);

  if (gettingAll)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="giant" />
      </View>
    );

  return (
    <View style={styles.body}>
      <List
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.list}
        data={groups}
        renderItem={renderItem}
      />
      <FloatingButton onPress={() => {}}>
        <MaterialIcons name="add" size={24} color="#fff" onPress={() => setVisible(true)} />
      </FloatingButton>
      <ModalAddGroup visible={visible} setVisible={setVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 12,
    position: 'relative',
  },
  card: {
    minWidth: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    gap: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberList: {
    flexDirection: 'row',
  },
});
