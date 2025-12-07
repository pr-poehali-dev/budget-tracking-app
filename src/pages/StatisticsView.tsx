import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  account: string;
  date: string;
  description: string;
}

const StatisticsView = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('finplan_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter(t => {
      const txDate = new Date(t.date);
      if (period === 'day') return txDate >= startOfDay;
      if (period === 'week') return txDate >= startOfWeek;
      if (period === 'month') return txDate >= startOfMonth;
      return true;
    });
  }, [transactions, period]);

  const { totalIncome, totalExpense, categoryData, dailyData } = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { amount: number, color: string }>();
    const colors = ['bg-orange-500', 'bg-red-500', 'bg-pink-500', 'bg-rose-500', 'bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-teal-500'];
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach((t, idx) => {
        const current = categoryMap.get(t.category) || { amount: 0, color: colors[idx % colors.length] };
        categoryMap.set(t.category, { amount: current.amount + t.amount, color: current.color });
      });

    const totalExpenseForPercent = expense || 1;
    const categoryArray = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        percent: Math.round((data.amount / totalExpenseForPercent) * 100),
        color: data.color
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    const now = new Date();
    let days: { day: string, income: number, expense: number }[] = [];

    if (period === 'day') {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      days = hours.map(h => ({
        day: `${h}:00`,
        income: 0,
        expense: 0
      }));
    } else if (period === 'week') {
      const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      days = weekDays.map(d => ({ day: d, income: 0, expense: 0 }));
      
      filteredTransactions.forEach(t => {
        const txDate = new Date(t.date);
        const dayOfWeek = (txDate.getDay() + 6) % 7;
        if (t.type === 'income') days[dayOfWeek].income += t.amount;
        else days[dayOfWeek].expense += t.amount;
      });
    } else {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      days = Array.from({ length: Math.min(daysInMonth, 31) }, (_, i) => ({
        day: `${i + 1}`,
        income: 0,
        expense: 0
      }));

      filteredTransactions.forEach(t => {
        const txDate = new Date(t.date);
        const dayOfMonth = txDate.getDate() - 1;
        if (dayOfMonth >= 0 && dayOfMonth < days.length) {
          if (t.type === 'income') days[dayOfMonth].income += t.amount;
          else days[dayOfMonth].expense += t.amount;
        }
      });
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      categoryData: categoryArray,
      dailyData: days
    };
  }, [filteredTransactions, period]);

  const maxAmount = Math.max(...dailyData.map(d => Math.max(d.income, d.expense)), 1);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Статистика</h2>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">День</TabsTrigger>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Доходы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{totalIncome.toLocaleString('ru-RU')} ₽</div>
            <p className="text-xs text-emerald-600 mt-1">
              за {period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Расходы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{totalExpense.toLocaleString('ru-RU')} ₽</div>
            <p className="text-xs text-red-600 mt-1">
              за {period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Норма сбережений</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{savingsRate}%</div>
            <p className="text-xs text-blue-600 mt-1">от дохода</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" className="h-5 w-5" />
              График доходов и расходов
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="Download" className="mr-2 h-4 w-4" />
                  Экспорт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Экспорт данных</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                    <Icon name="FileText" className="mr-2 h-5 w-5" />
                    Экспорт в PDF
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                    <Icon name="FileSpreadsheet" className="mr-2 h-5 w-5" />
                    Экспорт в Excel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyData.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{day.day}</span>
                  <div className="flex gap-4">
                    <span className="text-green-700 font-semibold">
                      +{day.income.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-red-600 font-semibold">
                      -{day.expense.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 h-8">
                  <div 
                    className="bg-green-600 rounded-lg transition-all hover:bg-green-700"
                    style={{ width: `${(day.income / maxAmount) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 rounded-lg transition-all hover:bg-red-600"
                    style={{ width: `${(day.expense / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="PieChart" className="h-5 w-5" />
              Расходы по категориям
            </CardTitle>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType('pie')}
                className={chartType === 'pie' ? 'bg-white shadow-sm' : ''}
              >
                <Icon name="PieChart" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'bg-white shadow-sm' : ''}
              >
                <Icon name="BarChart3" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {chartType === 'pie' && (
              <div className="flex items-center justify-center">
              <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
                {categoryData.reduce((acc, cat, index) => {
                  const prevSum = categoryData.slice(0, index).reduce((sum, c) => sum + c.percent, 0);
                  const circumference = 2 * Math.PI * 90;
                  const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((prevSum / 100) * circumference);
                  
                  return [
                    ...acc,
                    <circle
                      key={cat.name}
                      cx="140"
                      cy="140"
                      r="90"
                      fill="none"
                      stroke={
                        cat.color === 'bg-orange-500' ? '#f97316' :
                        cat.color === 'bg-red-500' ? '#ef4444' :
                        cat.color === 'bg-pink-500' ? '#ec4899' :
                        cat.color === 'bg-rose-500' ? '#f43f5e' :
                        '#6366f1'
                      }
                      strokeWidth="40"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all hover:opacity-80 cursor-pointer"
                    />
                  ];
                }, [] as JSX.Element[])}
                <circle cx="140" cy="140" r="60" fill="white" />
                <text x="140" y="135" textAnchor="middle" className="fill-slate-900 font-bold text-2xl transform rotate-90" style={{ transformOrigin: '140px 140px' }}>
                  {totalExpense.toLocaleString('ru-RU')}
                </text>
                <text x="140" y="155" textAnchor="middle" className="fill-slate-600 text-sm transform rotate-90" style={{ transformOrigin: '140px 140px' }}>
                  ₽
                </text>
              </svg>
              </div>
            )}

            {chartType === 'bar' && (
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat.name}</span>
                      <span className="font-semibold text-slate-900">
                        {cat.amount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-lg h-8 overflow-hidden">
                        <div
                          className={`h-full ${cat.color} transition-all`}
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                        {cat.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${cat.color} rounded`} />
                    <span className="font-medium text-slate-900">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">{cat.percent}%</span>
                    <span className="text-lg font-bold text-slate-900">
                      {cat.amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
          <CardHeader>
            <CardTitle className="text-violet-900 flex items-center gap-2">
              <Icon name="TrendingUp" className="h-5 w-5" />
              Самая большая категория дохода
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const incomeCategories = new Map<string, number>();
              filteredTransactions
                .filter(t => t.type === 'income')
                .forEach(t => {
                  incomeCategories.set(t.category, (incomeCategories.get(t.category) || 0) + t.amount);
                });
              const topIncome = Array.from(incomeCategories.entries())
                .sort((a, b) => b[1] - a[1])[0];
              
              if (!topIncome) {
                return <p className="text-slate-600">Нет данных</p>;
              }
              
              return (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <Icon name="Briefcase" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-900">{topIncome[0]}</p>
                    <p className="text-lg text-violet-700">{topIncome[1].toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Icon name="TrendingDown" className="h-5 w-5" />
              Самая большая категория расхода
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <Icon name="ShoppingCart" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{categoryData[0].name}</p>
                  <p className="text-lg text-amber-700">{categoryData[0].amount.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-600">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsView;