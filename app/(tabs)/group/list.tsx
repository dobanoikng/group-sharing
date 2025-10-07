import ControllerInput from '@/components/form/ControllerInput';
import StringAvatar from '@/components/ui/StringAvatar';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { Group, groupService } from '@/services/GroupServices';
import { groupMemberServices } from '@/services/UserServices';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Divider, List, Modal, Text } from '@ui-kitten/components';
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
    // const {
    //   data: { session },
    //   error,
    // } = await supabase.auth.signInWithPassword({
    //   email: 'admin@group.com',
    //   password: '123456',
    // });
    // if (error) Alert.alert(error.message + 'errr');
    // if (!session) Alert.alert('Please check your inbox for email verification!');
    // console.log({ session });
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
        <View {...headerProps}>
          <Text category="h3">{item.name}</Text>
        </View>
      )}
    >
      {item.group_members.map((grMember) => (
        <View key={grMember.user_id}>
          <StringAvatar text={grMember.profiles.full_name} />
        </View>
      ))}
    </Card>
  );

  useEffect(() => {
    onGetListGroup();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text>Nhóm</Text>
        <MaterialIcons name="add-circle-outline" size={36} onPress={() => setVisible(true)} />
      </View>
      <List
        style={styles.list}
        data={groups}
        ItemSeparatorComponent={Divider}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'gray',
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
  list: {},
});
