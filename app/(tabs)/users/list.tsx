import ModalAddUser from '@/components/modals/AddUser';
import StringAvatar from '@/components/ui/StringAvatar';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { IProfile, userServices } from '@/services/UserServices';
import { Button, Card, Divider, List, Text } from '@ui-kitten/components';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ListUser = () => {
  const [users, setUsers] = useState<IProfile[]>([]);
  const [visible, setVisible] = useState(false);

  const { call: getAll, loading } = useServiceLoader(userServices.getAll);

  const renderItem = ({ item: user }: { item: IProfile }) => {
    return (
      <>
        <View key={user.email} style={styles.row}>
          <StringAvatar size="small" text={user.full_name} />
          <View>
            <Text category="label">{user.full_name}</Text>
            <Text category="c1">{user.email}</Text>
          </View>
        </View>
        <Divider style={{ marginVertical: 10 }} />
      </>
    );
  };

  const onGetAll = async () => {
    setVisible(false);
    try {
      const data = await getAll();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetAll();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <List style={styles.list} data={users} renderItem={renderItem} />
      </Card>
      <View>
        <Button onPress={() => setVisible(true)}>{t('button.add')}</Button>
      </View>
      <ModalAddUser visible={visible} setVisible={setVisible} onSuccess={onGetAll} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-start',
  },
  list: {
    backgroundColor: 'transparent',
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ListUser;
