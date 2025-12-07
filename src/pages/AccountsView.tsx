import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  icon: string;
  color: string;
}

const AccountsView = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Тинькофф Black', type: 'card', balance: 48850, icon: 'CreditCard', color: 'from-yellow-400 to-yellow-600' },
    { id: '2', name: 'Сбербанк', type: 'card', balance: 12500, icon: 'CreditCard', color: 'from-green-400 to-green-600' },
    { id: '3', name: 'Наличные', type: 'cash', balance: 5000, icon: 'Wallet', color: 'from-slate-400 to-slate-600' },
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Общий баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalBalance.toLocaleString('ru-RU')} ₽</div>
          <p className="text-indigo-100 mt-2">на {accounts.length} счетах</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Мои счета</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить счёт
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый счёт</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="account-name">Название</Label>
                <Input id="account-name" placeholder="Название счёта" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-type">Тип</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Банковская карта</SelectItem>
                    <SelectItem value="cash">Наличные</SelectItem>
                    <SelectItem value="savings">Накопительный счёт</SelectItem>
                    <SelectItem value="investment">Инвестиции</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-balance">Начальный баланс</Label>
                <Input id="account-balance" type="number" placeholder="0" />
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Создать счёт</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${account.color}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center`}>
                  <Icon name={account.icon as any} className="h-6 w-6 text-white" />
                </div>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4">{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {account.balance.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-slate-600 mt-2 capitalize">
                {account.type === 'card' ? 'Банковская карта' : 
                 account.type === 'cash' ? 'Наличные' : 'Счёт'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountsView;
