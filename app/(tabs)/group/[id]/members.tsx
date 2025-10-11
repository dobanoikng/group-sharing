import ModalAddMember from '@/components/modals/AddMember';
import StringAvatar from '@/components/ui/StringAvatar';
import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { expenseSplitServices } from '@/services/ExpenseSplitServices';
import { groupMemberServices, IGroupMember } from '@/services/GroupMemberServices';
import { Button, Card, List, Text } from '@ui-kitten/components';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Members = ({ groupId }: { groupId: string }) => {
  const [groupMembers, setGroupMembers] = useState<IGroupMember[]>([]);
  const [visible, setVisible] = useState(false);
  const { showToast } = useToast();
  const { call: getAll, loading } = useServiceLoader(groupMemberServices.getAllFromGroup);
  const { call: remove, loading: removing } = useServiceLoader(groupMemberServices.remove);
  const { call: getExpenseOfUser, loading: getting } = useServiceLoader(
    expenseSplitServices.getAllOfUser,
  );

  const onGetListGroupMember = async () => {
    try {
      const groupMembers = await getAll(groupId);
      setGroupMembers(groupMembers);
    } catch (error) {
      console.error(error);
    }
    setVisible(false);
  };

  const onDeleteGroupMember = async (groupMemberId: string, userId: string) => {
    try {
      const data = await getExpenseOfUser(userId);
      if (data.find((item) => item?.expenses?.group_id === groupId)) {
        showToast('User in expense!', 3000);
      } else {
        await remove(groupMemberId);
        onGetListGroupMember();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: IGroupMember }) => {
    return (
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <StringAvatar text={item.profiles.full_name} />
            <View>
              <Text category="label">{item.profiles.full_name}</Text>
              <Text category="c2" appearance="hint">
                {item.role}
              </Text>
            </View>
          </View>
          {item.role !== 'owner' && (
            <Button
              size="small"
              status="danger"
              disabled={removing || loading || getting}
              onPress={() => onDeleteGroupMember(item.id, item.profiles.id)}
            >
              Delete
            </Button>
          )}
        </View>
      </Card>
    );
  };

  useEffect(() => {
    onGetListGroupMember();
  }, [groupId]);

  return (
    <>
      <View style={styles.container}>
        <List
          style={{ backgroundColor: 'transparent' }}
          data={groupMembers}
          renderItem={renderItem}
        />
        <Button onPress={() => setVisible(true)}>{t('add-member')}</Button>
      </View>
      <ModalAddMember
        groupId={groupId}
        visible={visible}
        setVisible={setVisible}
        onSuccess={onGetListGroupMember}
        currentMembers={groupMembers}
      />
    </>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
});
