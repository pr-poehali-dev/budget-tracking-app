import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  account: string;
  date: string;
  description: string;
}

const TransactionsView = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 50000, category: 'Зарплата', account: 'Тинькофф', date: '2025-12-01', description: 'Зарплата за ноябрь' },
    { id: '2', type: 'expense', amount: 1200, category: 'Продукты', account: 'Тинькофф', date: '2025-12-02', description: 'Пятёрочка' },
    { id: '3', type: 'expense', amount: 850, category: 'Транспорт', account: 'Наличные', date: '2025-12-03', description: 'Заправка' },
    { id: '4', type: 'income', amount: 15000, category: 'Фриланс', account: 'Сбербанк', date: '2025-12-04', description: 'Проект для клиента' },
    { id: '5', type: 'expense', amount: 3500, category: 'Развлечения', account: 'Тинькофф', date: '2025-12-05', description: 'Кино и ресторан' },
    { id: '6', type: 'expense', amount: 2800, category: 'Здоровье', account: 'Сбербанк', date: '2025-12-06', description: 'Аптека' },
    { id: '7', type: 'income', amount: 8000, category: 'Инвестиции', account: 'Тинькофф', date: '2025-12-07', description: 'Дивиденды' },
  ]);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Все транзакции</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-slate-900' : ''}
          >
            <Icon name="List" className="mr-2 h-4 w-4" />
            Все
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
            className={filter === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
          >
            <Icon name="TrendingUp" className="mr-2 h-4 w-4" />
            Доходы
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            onClick={() => setFilter('expense')}
            className={filter === 'expense' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            <Icon name="TrendingDown" className="mr-2 h-4 w-4" />
            Расходы
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Поиск по описанию..." className="w-full" />
            </div>
            <Select defaultValue="date">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="amount">По сумме</SelectItem>
                <SelectItem value="category">По категории</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Icon 
                      name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                      className="h-6 w-6" 
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-lg">{transaction.category}</p>
                    <p className="text-sm text-slate-600">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon name="CreditCard" className="h-3 w-3 text-slate-400" />
                      <p className="text-xs text-slate-500">{transaction.account}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(transaction.date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Всего транзакций</p>
              <p className="text-3xl font-bold text-slate-900">{filteredTransactions.length}</p>
            </div>
            <Button variant="outline" size="lg">
              <Icon name="Download" className="mr-2 h-5 w-5" />
              Экспортировать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsView;
