import StringAvatar from '@/components/ui/StringAvatar';
import { useToast } from '@/contexts/ToastContext';
import { useServiceLoader } from '@/hooks/UseServiceLoader';
import { groupMemberServices, IGroupMember } from '@/services/GroupMemberServices';
import { Group } from '@/services/GroupServices';
import { formatMoney } from '@/utils';
import { Card, List, Text } from '@ui-kitten/components';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type GroupState = Group & {
  expenses: {
    amount: number;
    title: string;
    paid_by: string;
    expense_splits: {
      amount: number;
      user_id: string;
    }[];
  }[];
};
type MemberExpense = IGroupMember & { expenses: { title: string; amount: number }[] };

const Summary = ({ group }: { group: GroupState }) => {
  const [groupMembers, setGroupMembers] = useState<MemberExpense[]>([]);

  const { showToast } = useToast();

  const { call: getAllMember } = useServiceLoader(groupMemberServices.getAllFromGroup);

  const onGetListGroupMember = async () => {
    try {
      const groupMembers = await getAllMember(group.id);
      const dataList = groupMembers.map((gm) => {
        const expenseOfUser = group.expenses
          .filter((ex) => {
            return ex.expense_splits.find(
              (exSplit: any) => exSplit.user_id === gm.profiles.id && exSplit.amount > 0,
            );
          })
          .map((ex) => {
            const exsp = ex.expense_splits.find(
              (exSplit: any) => exSplit.user_id === gm.profiles.id && exSplit.amount > 0,
            );

            return {
              title: ex.title,
              amount: exsp!.amount,
            };
          });
        return {
          ...gm,
          expenses: expenseOfUser,
        };
      });

      setGroupMembers(dataList);
    } catch (error: any) {
      if (error?.message) showToast(error.message, { type: 'error' });
    }
  };

  const calculatorTotalAmountMember = (item: MemberExpense) => {
    const amount = item.expenses.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0);
    const amountPayed = group.expenses
      .filter((ex) => ex.paid_by === item.user_id)
      .reduce((acc, crr) => acc + crr.amount, 0);
    const total =
      amountPayed - amount > 0
        ? '+' + formatMoney(amountPayed - amount)
        : formatMoney(amountPayed - amount);
    return { amount, amountPayed, total, rawTotal: amountPayed - amount };
  };

  useEffect(() => {
    onGetListGroupMember();
  }, []);

  const renderItem = ({ item }: { item: MemberExpense }) => {
    const totals = calculatorTotalAmountMember(item);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.memberInfoContainer}>
          <View style={styles.memberNameContainer}>
            <StringAvatar text={item.profiles.full_name} />
            <Text category="s1" style={styles.memberName}>
              {item.profiles.full_name}
            </Text>
          </View>

          {item.expenses.length > 0 && (
            <View style={styles.expenseListContainer}>
              {item.expenses.map((ex, i) => (
                <View style={styles.expenseItem} key={`${ex.title}-${i}`}>
                  <Text style={styles.expenseTitle} numberOfLines={1} ellipsizeMode="tail">
                    {ex.title}
                  </Text>
                  <Text style={styles.expenseAmount}>{formatMoney(ex.amount)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalAmount, styles.amountPaid]}>
              {formatMoney(totals.amountPayed)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalAmount, styles.amountOwed]}>
              {formatMoney(totals.amount)}
            </Text>
          </View>
          <View style={styles.balanceRow}>
            <Text
              style={[
                styles.balanceAmount,
                totals.rawTotal > 0 ? styles.positiveBalance : styles.negativeBalance,
              ]}
            >
              {totals.total}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Card style={styles.cardInfo}>
          <View style={styles.center}>
            <Text category="h4">{group.name}</Text>
            <Text category="p1" appearance="hint">
              {group.description}
            </Text>
            <Text category="h6" style={{ marginTop: 8 }}>
              {t('total-amount')}:{' '}
              {formatMoney(group.expenses.reduce((acc, crrValue) => acc + crrValue.amount, 0))}
            </Text>
          </View>
        </Card>
      </View>
      <Text category="h5" style={styles.membersHeader}>
        {t('member')}
      </Text>
      <List
        contentContainerStyle={styles.listContainer}
        data={groupMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  headerContainer: {
    padding: 16,
  },
  cardInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  membersHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  memberInfoContainer: {
    flex: 1,
    marginRight: 16,
  },
  memberNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontWeight: 'bold',
  },
  expenseListContainer: {
    marginTop: 12,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    maxWidth: '50%',
  },
  expenseTitle: {
    fontSize: 14,
    color: '#5f6c80',
    flexShrink: 1,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333e4d',
    marginLeft: 8,
  },
  totalsContainer: {
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountPaid: {
    color: '#2e7d32',
  },
  amountOwed: {
    color: '#c62828',
  },
  balanceRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eef1f5',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#333e4d',
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#2e7d32',
  },
  negativeBalance: {
    color: '#c62828',
  },
});
