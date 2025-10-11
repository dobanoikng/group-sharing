import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { userServices } from '@/services/UserServices';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Modal } from '@ui-kitten/components';
import { t } from 'i18next';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import z from 'zod';
import ControllerInput from '../form/ControllerInput';

const userSchema = z.object({
  full_name: z.string().min(1, 'Tên được để trống'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Mat khau phai 6'),
});

type UserFormValues = z.infer<typeof userSchema>;

type IProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: CallableFunction;
};
const ModalAddUser = ({ visible, setVisible, onSuccess }: IProps) => {
  const { control, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const { call: createUser, loading } = useServiceLoader(userServices.create);

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data);
      onSuccess();
      control._reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} animationType="slide">
      <Card disabled={true} style={styles.card}>
        <View>
          <Text style={styles.title}>{t('user.modal-title')}</Text>
        </View>
        <View style={styles.input}>
          <ControllerInput control={control} name="full_name" placeholder="Name" />
        </View>
        <View style={styles.input}>
          <ControllerInput control={control} name="email" placeholder="Email" />
        </View>
        <View style={styles.input}>
          <ControllerInput control={control} name="password" placeholder="Password" />
        </View>

        <Button disabled={loading} onPress={handleSubmit(onSubmit)}>
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

export default ModalAddUser;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  body: {
    padding: 12,
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
  },
  iconClose: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});
