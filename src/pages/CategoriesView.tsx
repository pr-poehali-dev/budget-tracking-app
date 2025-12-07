import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

const CategoriesView = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Зарплата', icon: 'Briefcase', color: 'bg-emerald-500', type: 'income' },
    { id: '2', name: 'Фриланс', icon: 'Laptop', color: 'bg-blue-500', type: 'income' },
    { id: '3', name: 'Инвестиции', icon: 'TrendingUp', color: 'bg-purple-500', type: 'income' },
    { id: '4', name: 'Продукты', icon: 'ShoppingCart', color: 'bg-orange-500', type: 'expense' },
    { id: '5', name: 'Транспорт', icon: 'Car', color: 'bg-red-500', type: 'expense' },
    { id: '6', name: 'Развлечения', icon: 'Gamepad2', color: 'bg-pink-500', type: 'expense' },
    { id: '7', name: 'Здоровье', icon: 'Heart', color: 'bg-rose-500', type: 'expense' },
    { id: '8', name: 'Образование', icon: 'GraduationCap', color: 'bg-indigo-500', type: 'expense' },
  ]);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
      <CardContent className="p-6 flex flex-col items-center gap-3">
        <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon name={category.icon as any} className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-semibold text-slate-900">{category.name}</h3>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Категории</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая категория</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Название</Label>
                <Input id="category-name" placeholder="Название категории" />
              </div>
              <div className="grid gap-2">
                <Label>Тип</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="TrendingUp" className="mr-2 h-4 w-4" />
                    Доход
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="TrendingDown" className="mr-2 h-4 w-4" />
                    Расход
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Иконка (выберите)</Label>
                <div className="grid grid-cols-6 gap-2">
                  {['ShoppingCart', 'Car', 'Home', 'Coffee', 'Plane', 'Gift'].map(iconName => (
                    <Button key={iconName} variant="outline" size="icon">
                      <Icon name={iconName as any} className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Создать</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="income">Доходы</TabsTrigger>
          <TabsTrigger value="expense">Расходы</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">Доходы</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {incomeCategories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-4">Расходы</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {expenseCategories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {incomeCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expense" className="mt-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {expenseCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoriesView;