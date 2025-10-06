import ControllerInput from '@/components/form/ControllerInput';
import { t } from 'i18next';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, View } from 'react-native';

type IFormData = {
  name: string;
  description?: string;
};

const CreateGroup = () => {
  const { control, handleSubmit } = useForm<IFormData>({});
  const onSubmit = (data: IFormData) => {
    console.log(data);
  };
  return (
    <View>
      <View>
        <ControllerInput<IFormData> control={control} name="name" />
        <ControllerInput<IFormData> control={control} name="description" />
        <Button title={t('button.create')} onPress={() => handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({});
