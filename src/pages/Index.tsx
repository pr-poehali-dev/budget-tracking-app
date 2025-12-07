import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import DashboardView from './DashboardView';
import AccountsView from './AccountsView';
import CategoriesView from './CategoriesView';
import TransactionsView from './TransactionsView';
import StatisticsView from './StatisticsView';
import ImportView from './ImportView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Wallet" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Мои Финансы</h1>
                <p className="text-slate-600 text-sm">Полный контроль над бюджетом</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-white/80 backdrop-blur shadow-md">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="LayoutDashboard" size={20} />
                <span className="text-xs font-medium">Главная</span>
              </TabsTrigger>
              <TabsTrigger 
                value="accounts"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="CreditCard" size={20} />
                <span className="text-xs font-medium">Счета</span>
              </TabsTrigger>
              <TabsTrigger 
                value="categories"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="FolderTree" size={20} />
                <span className="text-xs font-medium">Категории</span>
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="ArrowLeftRight" size={20} />
                <span className="text-xs font-medium">Транзакции</span>
              </TabsTrigger>
              <TabsTrigger 
                value="statistics"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="BarChart3" size={20} />
                <span className="text-xs font-medium">Статистика</span>
              </TabsTrigger>
              <TabsTrigger 
                value="import"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon name="Upload" size={20} />
                <span className="text-xs font-medium">Импорт</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="dashboard" className="animate-fade-in">
                <DashboardView />
              </TabsContent>
              <TabsContent value="accounts" className="animate-fade-in">
                <AccountsView />
              </TabsContent>
              <TabsContent value="categories" className="animate-fade-in">
                <CategoriesView />
              </TabsContent>
              <TabsContent value="transactions" className="animate-fade-in">
                <TransactionsView />
              </TabsContent>
              <TabsContent value="statistics" className="animate-fade-in">
                <StatisticsView />
              </TabsContent>
              <TabsContent value="import" className="animate-fade-in">
                <ImportView />
              </TabsContent>
            </div>
          </Tabs>
        </header>
      </div>
    </div>
  );
};

export default Index;