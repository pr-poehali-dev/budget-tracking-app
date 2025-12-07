import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const DashboardView = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finplan_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', type: 'income', amount: 50000, category: 'Зарплата', account: 'Тинькофф', date: '2025-12-01', description: 'Зарплата за ноябрь' },
      { id: '2', type: 'expense', amount: 1200, category: 'Продукты', account: 'Тинькофф', date: '2025-12-02', description: 'Пятёрочка' },
      { id: '3', type: 'expense', amount: 850, category: 'Транспорт', account: 'Наличные', date: '2025-12-03', description: 'Заправка' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('finplan_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [incomeAccount, setIncomeAccount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAccount, setExpenseAccount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddIncome = () => {
    const amount = parseFloat(incomeAmount);
    
    if (!incomeAmount || isNaN(amount) || amount <= 0) {
      alert('Пожалуйста, введите корректную сумму');
      return;
    }
    
    if (!incomeCategory) {
      alert('Пожалуйста, выберите категорию');
      return;
    }
    
    if (!incomeAccount) {
      alert('Пожалуйста, выберите счёт');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'income',
      amount: amount,
      category: incomeCategory,
      account: incomeAccount,
      date: new Date().toISOString().split('T')[0],
      description: incomeDescription || 'Без описания'
    };

    setTransactions([newTransaction, ...transactions]);
    setIncomeAmount('');
    setIncomeCategory('');
    setIncomeAccount('');
    setIncomeDescription('');
    setIsIncomeDialogOpen(false);
  };

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    
    if (!expenseAmount || isNaN(amount) || amount <= 0) {
      alert('Пожалуйста, введите корректную сумму');
      return;
    }
    
    if (!expenseCategory) {
      alert('Пожалуйста, выберите категорию');
      return;
    }
    
    if (!expenseAccount) {
      alert('Пожалуйста, выберите счёт');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount: amount,
      category: expenseCategory,
      account: expenseAccount,
      date: new Date().toISOString().split('T')[0],
      description: expenseDescription || 'Без описания'
    };

    setTransactions([newTransaction, ...transactions]);
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseAccount('');
    setExpenseDescription('');
    setIsExpenseDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Доходы</CardTitle>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Icon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">
              {totalIncome.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs text-emerald-600 mt-1">+12.5% от прошлого месяца</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Расходы</CardTitle>
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Icon name="TrendingDown" className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {totalExpense.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs text-red-600 mt-1">-8.3% от прошлого месяца</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Баланс</CardTitle>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Icon name="Wallet" className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {balance.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs text-blue-600 mt-1">Общий баланс</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-16 text-lg shadow-lg hover:shadow-xl transition-all">
              <Icon name="Plus" className="mr-2 h-6 w-6" />
              Добавить доход
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Новый доход</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Сумма</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={incomeCategory} onValueChange={setIncomeCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Зарплата">Зарплата</SelectItem>
                    <SelectItem value="Фриланс">Фриланс</SelectItem>
                    <SelectItem value="Инвестиции">Инвестиции</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account">Счёт</Label>
                <Select value={incomeAccount} onValueChange={setIncomeAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите счёт" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Тинькофф">Тинькофф</SelectItem>
                    <SelectItem value="Сбербанк">Сбербанк</SelectItem>
                    <SelectItem value="Наличные">Наличные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Input 
                  id="description" 
                  placeholder="Комментарий"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={handleAddIncome}
              >
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white h-16 text-lg shadow-lg hover:shadow-xl transition-all">
              <Icon name="Minus" className="mr-2 h-6 w-6" />
              Добавить расход
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Новый расход</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-amount">Сумма</Label>
                <Input 
                  id="expense-amount" 
                  type="number" 
                  placeholder="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-category">Категория</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Продукты">Продукты</SelectItem>
                    <SelectItem value="Транспорт">Транспорт</SelectItem>
                    <SelectItem value="Развлечения">Развлечения</SelectItem>
                    <SelectItem value="Здоровье">Здоровье</SelectItem>
                    <SelectItem value="Образование">Образование</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-account">Счёт</Label>
                <Select value={expenseAccount} onValueChange={setExpenseAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите счёт" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Тинькофф">Тинькофф</SelectItem>
                    <SelectItem value="Сбербанк">Сбербанк</SelectItem>
                    <SelectItem value="Наличные">Наличные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-description">Описание</Label>
                <Input 
                  id="expense-description" 
                  placeholder="Комментарий"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={handleAddExpense}
              >
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" className="h-5 w-5" />
            Последние транзакции
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Icon 
                      name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                      className="h-5 w-5" 
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{transaction.category}</p>
                    <p className="text-sm text-slate-600">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{transaction.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;