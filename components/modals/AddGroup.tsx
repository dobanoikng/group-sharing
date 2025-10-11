import { useAuth } from '@/contexts/AuthContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { groupMemberServices } from '@/services/GroupMemberServices';
import { groupService } from '@/services/GroupServices';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Modal } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import z from 'zod';
import ControllerInput from '../form/ControllerInput';

const groupSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

type IProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: CallableFunction;
};
const ModalAddGroup = ({ visible, setVisible }: IProps) => {
  const router = useRouter();
  const { session } = useAuth();
  const { loading: creatingGroup, call: createGroup } = useServiceLoader(groupService.add);
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
        created_by: session!.user.id,
      });

      if (group.id) {
        await createGroupMember({
          group_id: group.id,
          user_id: session!.user.id,
          role: 'owner',
        });
      }
      setVisible(false);
      router.navigate(`/(tabs)/group/${group.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
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
        <MaterialIcons
          style={styles.iconClose}
          name="close"
          size={24}
          onPress={() => {
            setVisible(false);
            control._reset();
          }}
        />
      </Card>
    </Modal>
  );
};

export default ModalAddGroup;

const styles = StyleSheet.create({
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
  iconClose: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});
