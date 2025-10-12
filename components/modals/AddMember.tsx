import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { groupMemberServices, IGroupMember } from '@/services/GroupMemberServices';
import { IProfile, userServices } from '@/services/UserServices';
import { Button, Card, CheckBox, List, Modal, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import StringAvatar from '../ui/StringAvatar';

type IProps = {
  groupId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: CallableFunction;
  currentMembers: IGroupMember[];
};
const ModalAddMember = ({ groupId, visible, setVisible, onSuccess, currentMembers }: IProps) => {
  const [users, setUsers] = useState<IProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { showToast } = useToast();

  const { call: createGroupMember, loading } = useServiceLoader(groupMemberServices.add);
  const { call: getAll } = useServiceLoader(userServices.getAll);

  const onCreateGroupMember = async () => {
    try {
      const groupMembersData = selected.map((userId) => ({
        group_id: groupId,
        user_id: userId,
        role: 'member',
      }));
      if (groupMembersData) {
        await createGroupMember(groupMembersData);
      }
      onSuccess();
    } catch (error: any) {
      if (error?.message) showToast(error.message, { type: 'error' });
    }
  };

  const renderItem = ({ item: user }: { item: IProfile }) => {
    return (
      <Card
        key={user.email}
        style={{
          marginBottom: 16,
        }}
        onPress={() => {
          const hasSelected = selected.includes(user.id);
          if (hasSelected) {
            setSelected([...selected].filter((id) => id !== user.id));
          } else {
            setSelected([...selected, user.id]);
          }
        }}
      >
        <View style={styles.rowContent}>
          <View style={styles.row}>
            <StringAvatar size="small" text={user.full_name} />
            <View>
              <Text category="label">{user.full_name}</Text>
              <Text category="c1">{user.email}</Text>
            </View>
          </View>
          <CheckBox
            onChange={(checked) => {
              if (checked) {
                setSelected([...selected, user.id]);
              } else {
                setSelected([...selected].filter((id) => id !== user.id));
              }
            }}
            checked={selected.includes(user.id)}
          />
        </View>
      </Card>
    );
  };

  const onGetAll = async () => {
    try {
      const data = await getAll();

      const userNotInGroup = data.filter(
        (item) => !currentMembers.find((cm) => cm.user_id === item.id),
      );

      setUsers(userNotInGroup);
    } catch (error: any) {
      if (error?.message) showToast(error.message, { type: 'error' });
    }
  };

  useEffect(() => {
    onGetAll();
    setSelected([]);
  }, [currentMembers, visible]);

  return (
    <Modal
      pointerEvents="box-none"
      visible={visible}
      backdropStyle={styles.backdrop}
      animationType="slide"
    >
      <Card style={styles.card} disabled>
        <View style={{ height: '90%' }}>
          {users.length > 0 ? (
            <View style={{ gap: 20 }}>
              <CheckBox
                checked={users.every((item) => selected.includes(item.id))}
                onChange={(checked) => {
                  if (checked) setSelected([...users].map((item) => item.id));
                  else setSelected([]);
                }}
              >
                Select all
              </CheckBox>
              <List style={styles.list} data={users} renderItem={renderItem} />
            </View>
          ) : (
            <Text category="h3">NO MEMBER CAN ADD</Text>
          )}
        </View>
        <View style={[styles.row, { justifyContent: 'center', bottom: 0 }]}>
          <Button
            onPress={() => {
              if (!loading) {
                setVisible(false);
              }
            }}
            appearance="outline"
          >
            Close
          </Button>
          <Button
            onPress={() => {
              if (!loading) {
                onCreateGroupMember();
              }
            }}
          >
            Save
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

export default ModalAddMember;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  card: {
    minWidth: '90%',
    minHeight: '80%',
  },
  list: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-start',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
