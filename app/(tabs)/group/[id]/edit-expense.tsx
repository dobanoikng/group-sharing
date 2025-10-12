import ControllerInput from '@/components/form/ControllerInput';
import { ControllerSelect } from '@/components/form/ControllerSelect';
import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { expenseServices } from '@/services/ExpenseServices';
import { expenseSplitServices } from '@/services/ExpenseSplitServices';
import { groupMemberServices } from '@/services/GroupMemberServices';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Divider, Layout, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import z from 'zod';

interface Option {
  label: string;
  value: string;
}

const ExpenseSchema = z
  .object({
    title: z.string().min(1, { message: 'min 1' }),
    amount: z.string().min(1),
    paid_by: z.string().min(1),
    expense_splits: z
      .array(
        z.object({
          id: z.string(),
          user_id: z.string(),
          amount: z.string().min(0, { message: 'Amount must be >= 0' }),
        }),
      )
      .min(1, { message: 'Must have at least one split' }),
  })
  .refine(
    (data) => {
      const totalSplit = data.expense_splits.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
      return Math.abs(totalSplit - Number(data.amount)) < 10; // cho phép lệch nhỏ
    },
    {
      message: 'Tổng số tiền chia phải bằng tổng tiền',
      path: ['expense_splits'], // hiển thị lỗi ở nhóm splits
    },
  );

type ExpenseFormData = z.infer<typeof ExpenseSchema>;

const EditExpense = () => {
  const { id, expenseId } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [memberOptions, setMemberOptions] = useState<Option[]>([]);

  const { call: getAll, loading } = useServiceLoader(groupMemberServices.getAllFromGroup);
  const { call: updateExpense, loading: adding } = useServiceLoader(expenseServices.update);
  const { call: detailExpense, loading: detailing } = useServiceLoader(expenseServices.detail);
  const { call: updateExpenseSplit, loading: addingSplit } = useServiceLoader(
    expenseSplitServices.update,
  );
  const { call: addExpenseSplit } = useServiceLoader(expenseSplitServices.add);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema),
  });

  const totalAmount = watch('amount');
  const expenseSplits = watch('expense_splits');

  const onGetListGroupMember = async () => {
    try {
      const [groupMembers, expenseDetail] = await Promise.all([
        getAll(id as string),
        detailExpense(expenseId as string),
      ]);

      setMemberOptions(
        groupMembers.map((item) => ({ label: item.profiles.full_name, value: item.profiles.id })),
      );
      setValue('amount', String(expenseDetail.amount));
      setValue('title', expenseDetail.title);
      setValue('paid_by', expenseDetail.paid_by);
      setValue(
        'expense_splits',
        groupMembers.map((item) => {
          const exSpit = expenseDetail.expense_splits.find(
            (_item: any) => _item.user_id === item.profiles.id,
          );
          return {
            id: exSpit?.id ?? '-',
            user_id: item.profiles.id,
            amount: String(exSpit?.amount ?? 0),
          };
        }),
      );
    } catch (error: any) {
      if (error?.message) {
        showToast(error?.message, { type: 'error' });
      }
    }
  };

  const splitEqually = () => {
    const amount = Number(totalAmount);
    if (!amount || amount <= 0) return;

    const perMember = amount / memberOptions.length;

    setValue(
      'expense_splits',
      memberOptions.map((m) => ({
        id: expenseSplits.find((ex) => ex.user_id === m.value)!.id,
        user_id: m.value,
        amount: `${Math.round(perMember)}`,
      })),
    );
  };

  const handleSplitChange = (index: number, newAmount: number) => {
    const splits = [...expenseSplits];
    const total = Number(totalAmount);

    // Tính phần còn lại
    const otherIndexes = splits.map((_, i) => i).filter((i) => i !== index);
    const remaining = total - newAmount;

    if (remaining < 0) return; // Không cho vượt quá tổng

    const evenShare = remaining / otherIndexes.length;

    // Gán lại amount mới
    splits[index].amount = `${newAmount}`;
    otherIndexes.forEach((i) => (splits[i].amount = `${evenShare}`));

    setValue('expense_splits', splits, { shouldValidate: true });
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      console.log(data);
      const expense = await updateExpense(expenseId as string, {
        amount: Number(data.amount),
        currency: 'VND',
        group_id: id as string,
        title: data.title,
        paid_by: data.paid_by,
      });
      const expenseSplits = data.expense_splits.map((i) => {
        const data = {
          user_id: i.user_id,
          amount: Number(i.amount),
          expense_id: expense.id,
        };
        if (i.id === '-') return addExpenseSplit([data]);
        return updateExpenseSplit(i.id, data);
      });

      await Promise.all(expenseSplits);
      router.back();
    } catch (error: any) {
      if (error?.message) showToast(error?.message);
    }
  };

  useEffect(() => {
    onGetListGroupMember();
  }, [id]);

  return (
    <Layout style={styles.container}>
      <View style={styles.form}>
        <ControllerInput<ExpenseFormData>
          control={control}
          name="title"
          placeholder={t('expense-form.title')}
        />
        <ControllerInput<ExpenseFormData>
          control={control}
          name="amount"
          placeholder={t('expense-form.amount')}
          textInputProps={{
            keyboardType: 'numeric',
          }}
        />
        <ControllerSelect
          control={control}
          name="paid_by"
          placeholder={t('expense-form.payer')}
          options={memberOptions}
        />
        <Divider />
        <View style={styles.flexRow}>
          <Text category="h6">{t('split-members')}</Text>
          <Button
            size="small"
            status="primary"
            appearance="outline"
            disabled={!totalAmount || Number(totalAmount) <= 0}
            onPress={splitEqually}
          >
            {t('split-evenly')}
          </Button>
        </View>

        {memberOptions.map((mo, index) => {
          return (
            <Card key={mo.value}>
              <View style={styles.flexRow}>
                <Text category="label">{mo.label}</Text>
                <ControllerInput<ExpenseFormData>
                  control={control}
                  name={`expense_splits.${index}.amount`}
                  placeholder={t('expense-form.amount')}
                  textInputProps={{
                    keyboardType: 'numeric',
                    onChangeText: (text) => {
                      const val = Number(text) || 0;
                      handleSplitChange(index, val);
                    },
                  }}
                />
              </View>
            </Card>
          );
        })}
        {errors.expense_splits && (
          <Text status="danger">{errors.expense_splits.root?.message}</Text>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading || adding || addingSplit ? 'Loading...' : t('button.edit')}
        </Button>
      </View>
    </Layout>
  );
};

export default EditExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
