import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StatisticsView = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');

  const categoryData = [
    { name: 'Продукты', amount: 12500, percent: 35, color: 'bg-orange-500' },
    { name: 'Транспорт', amount: 8500, percent: 24, color: 'bg-red-500' },
    { name: 'Развлечения', amount: 6000, percent: 17, color: 'bg-pink-500' },
    { name: 'Здоровье', amount: 5000, percent: 14, color: 'bg-rose-500' },
    { name: 'Образование', amount: 3500, percent: 10, color: 'bg-indigo-500' },
  ];

  const dailyData = [
    { day: 'Пн', income: 5000, expense: 1200 },
    { day: 'Вт', income: 0, expense: 850 },
    { day: 'Ср', income: 15000, expense: 2300 },
    { day: 'Чт', income: 0, expense: 1800 },
    { day: 'Пт', income: 8000, expense: 3500 },
    { day: 'Сб', income: 0, expense: 4200 },
    { day: 'Вс', income: 0, expense: 2100 },
  ];

  const maxAmount = Math.max(...dailyData.map(d => Math.max(d.income, d.expense)));

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
            <CardTitle className="text-sm font-medium text-emerald-900">Средний доход</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">73,000 ₽</div>
            <p className="text-xs text-emerald-600 mt-1">в месяц</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Средний расход</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">35,950 ₽</div>
            <p className="text-xs text-red-600 mt-1">в месяц</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Норма сбережений</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">51%</div>
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
                    <span className="text-emerald-600 font-semibold">
                      +{day.income.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-red-600 font-semibold">
                      -{day.expense.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 h-8">
                  <div 
                    className="bg-emerald-500 rounded-lg transition-all hover:bg-emerald-600"
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
          <CardTitle className="flex items-center gap-2">
            <Icon name="PieChart" className="h-5 w-5" />
            Расходы по категориям
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className={`${cat.color} transition-all hover:opacity-80 cursor-pointer`}
                  style={{ width: `${cat.percent}%` }}
                  title={`${cat.name}: ${cat.amount.toLocaleString('ru-RU')} ₽`}
                />
              ))}
            </div>

            <div className="space-y-3 mt-6">
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Icon name="Briefcase" className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-900">Зарплата</p>
                <p className="text-lg text-violet-700">50,000 ₽</p>
              </div>
            </div>
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Icon name="ShoppingCart" className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">Продукты</p>
                <p className="text-lg text-amber-700">12,500 ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsView;