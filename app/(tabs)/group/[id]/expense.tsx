import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { expenseServices, IExpense } from '@/services/ExpenseServices';
import { Button, Card, List, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
type IProps = {
  groupId: string;
};

const Expense = ({ groupId }: IProps) => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<IExpense[]>([]);

  const { call: getListExpense, loading } = useServiceLoader(expenseServices.getAllFromGroup);

  const onGetListExpenses = async () => {
    try {
      const data = await getListExpense(groupId);
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onGetListExpenses();
  }, [groupId]);

  return (
    <View style={styles.container}>
      <List style={{ backgroundColor: 'transparent' }} data={expenses} renderItem={renderItem} />
      <Button
        onPress={() => router.navigate(`/(tabs)/group/${groupId}/create-expense`)}
        style={styles.fixedButton}
      >
        {t('add-expense')}
      </Button>
    </View>
  );
};

export default Expense;

const renderItem = ({ item }: { item: IExpense }) => {
  return (
    <Card
      header={(headerProps) => (
        <View {...headerProps}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text category="h6">{item.title}</Text>
              <Text category="h6">${item.amount}</Text>
            </View>
            <Text category="c2" appearance="hint">
              Paid by {item.profiles.full_name}
            </Text>
          </View>
        </View>
      )}
      // onPress={() => router.navigate(`/(tabs)/group/${item.id}`)}
      style={{
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          gap: 5,
        }}
      >
        {item.expense_splits.map((p) => (
          <Text category="c2" appearance="hint" key={p.profiles.id}>
            {p.profiles.full_name}: ${p.amount}
          </Text>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  fixedButton: { position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 10 },
});
