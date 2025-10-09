import ControllerInput from '@/components/form/ControllerInput';
import StringAvatar from '@/components/ui/StringAvatar';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { groupMemberServices } from '@/services/GroupMemberServices';
import { Group, groupService } from '@/services/GroupServices';
import { formatDate } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, List, Modal, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const groupSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

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
};

export default function ListGroup() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [groups, setGroups] = useState<GroupList[]>([]);
  const { loading: creatingGroup, call: createGroup } = useServiceLoader(groupService.add);
  const { loading: getingAll, call: getAllGroup } = useServiceLoader(groupService.getAll);
  const { loading: creatingGroupMember, call: createGroupMember } = useServiceLoader(
    groupMemberServices.add,
  );
  const { control, handleSubmit } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const onSubmit = async ({ name, description }: GroupFormValues) => {
    try {
      const group = await createGroup({
        name,
        description,
        created_by: '9e561c83-bce8-4f40-bf27-e94e6bb55de3',
      });

      if (group.id) {
        await createGroupMember({
          group_id: group.id,
          user_id: '9e561c83-bce8-4f40-bf27-e94e6bb55de3',
          role: 'owner',
        });
      }
      setVisible(false);
      router.navigate(`/(tabs)/group/${group.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const onGetListGroup = async () => {
    try {
      const data = await getAllGroup();
      console.log(data);

      setGroups(data);
    } catch (error) {
      console.error(error);
    }
  };
  const renderItem = ({ item }: { item: GroupList }) => (
    <Card
      header={(headerProps) => (
        <View {...headerProps} style={[
          headerProps?.style,
          styles.card_header
        ]}>
          <View>
            <Text category="h6">{item.name}</Text>
            <Text category="c2" appearance='hint'>{formatDate(item.created_at)}</Text>
          </View>
          <Text category="label" style={{
            fontSize: 22
          }}>
            $180
          </Text>
        </View>
      )}
      style={{
        marginBottom: 12,
        borderRadius: 24,
      }}
      onPress={() => router.navigate(`/(tabs)/group/${item.id}`)}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{
          flexDirection: 'row',
          gap: 5
        }}>
          {item.group_members.slice(0, 3).map((grMember) => (
            <View key={grMember.user_id}>
              <StringAvatar text={grMember.profiles.full_name} />
            </View>
          ))}
          {item.group_members.length > 3 && <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eeeaeaff',
          }}>
            <Text style={{
              color: 'green'
            }}>
              +{item.group_members.length - 3}
            </Text>
          </View>}
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text category="c1" appearance='hint'>Sharing: </Text>
          <Text category="p1">{item.group_members.length} Persons</Text>
        </View>
      </View>
    </Card>
  );

  useEffect(() => {
    onGetListGroup();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.body}>
        <View style={styles.container}>
          <Text>{t('group.title')}</Text>
          <MaterialIcons name="add-circle-outline" size={24} onPress={() => setVisible(true)} />
        </View>
        <List
          style={styles.list}
          data={groups}
          renderItem={renderItem}
        />
        <Modal visible={visible} backdropStyle={styles.backdrop} animationType="slide">
          <Card disabled={true} style={styles.card}>
            <View>
              <Text style={styles.title}>{t('group.modal-title')}</Text>
            </View>
            <View style={styles.input}>
              <ControllerInput control={control} name="name" placeholder="Name" />
            </View>
            <View style={styles.input}>
              <ControllerInput control={control} name="description" placeholder="Description" />
            </View>

            <Button disabled={creatingGroup || creatingGroupMember} onPress={handleSubmit(onSubmit)}>
              {t('button.create')}
            </Button>
          </Card>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  body: {
    padding: 12
  },
  container: {
    paddingVertical: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    minWidth: '80%',
  },
  input: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    backgroundColor: 'transparent',
  },
  card_header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  }
});
