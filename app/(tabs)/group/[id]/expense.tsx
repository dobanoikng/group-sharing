import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { expenseServices, IExpense } from '@/services/ExpenseServices';
import { Card, List, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
type IProps = {
  groupId: string;
};

const Expense = ({ groupId }: IProps) => {
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
    <View>
      <List style={{ backgroundColor: 'transparent' }} data={expenses} renderItem={renderItem} />
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

const styles = StyleSheet.create({});
