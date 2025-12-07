import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
}

const ImportView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'csv' || fileExt === 'txt') {
      const text = await file.text();
      parseCSV(text);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      parseExcel(file);
    } else {
      alert('Поддерживаются только CSV, TXT, XLS, XLSX файлы');
      setIsProcessing(false);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const transactions: ParsedTransaction[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;]/);
      
      if (parts.length >= 3) {
        const dateStr = parts[0]?.trim();
        const desc = parts[1]?.trim();
        const amountStr = parts[2]?.trim().replace(/[^\d.,-]/g, '').replace(',', '.');
        const amount = parseFloat(amountStr);

        if (!isNaN(amount) && dateStr && desc) {
          transactions.push({
            date: dateStr,
            description: desc,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'income' : 'expense',
            category: guessCategory(desc, amount)
          });
        }
      }
    }

    setParsedData(transactions);
    setIsProcessing(false);
  };

  const parseExcel = async (file: File) => {
    alert('Для Excel файлов используйте экспорт в CSV из вашего банка');
    setIsProcessing(false);
  };

  const guessCategory = (description: string, amount: number): string => {
    const desc = description.toLowerCase();
    
    if (amount >= 0) {
      if (desc.includes('зарплат') || desc.includes('salary')) return 'Зарплата';
      if (desc.includes('перевод')) return 'Фриланс';
      return 'Другое';
    } else {
      if (desc.includes('магазин') || desc.includes('продукт') || desc.includes('пятёроч') || desc.includes('перекр')) return 'Продукты';
      if (desc.includes('транспорт') || desc.includes('такси') || desc.includes('заправ')) return 'Транспорт';
      if (desc.includes('кино') || desc.includes('ресторан') || desc.includes('кафе')) return 'Развлечения';
      if (desc.includes('аптек') || desc.includes('клиник')) return 'Здоровье';
      return 'Другое';
    }
  };

  const handleImport = () => {
    alert(`Импортировано ${parsedData.length} транзакций`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Импорт выписок</h2>
          <p className="text-slate-600 mt-1">Загрузите выписку из банка для автоматического добавления транзакций</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2">
              <Icon name="FileText" className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg">CSV / TXT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Универсальный формат для большинства банков. Экспортируйте выписку в CSV.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2">
              <Icon name="FileSpreadsheet" className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg">Excel (XLS, XLSX)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Сохраните выписку Excel как CSV для импорта в приложение.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2">
              <Icon name="Sparkles" className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg">Авто-категории</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Система автоматически определит категории по описанию транзакций.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-dashed">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging 
                ? 'border-cyan-500 bg-cyan-50' 
                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="FileCheck" className="h-8 w-8 text-cyan-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{uploadedFile.name}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFile(null);
                    setParsedData([]);
                  }}
                >
                  <Icon name="X" className="mr-2 h-4 w-4" />
                  Удалить файл
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="Upload" className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    Перетащите файл сюда
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    или нажмите кнопку ниже для выбора файла
                  </p>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>
                        <Icon name="FolderOpen" className="mr-2 h-4 w-4" />
                        Выбрать файл
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt,.xls,.xlsx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Поддерживаются форматы: CSV, TXT, XLS, XLSX
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isProcessing && (
        <Alert>
          <Icon name="Loader2" className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Обрабатываем файл...
          </AlertDescription>
        </Alert>
      )}

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="CheckCircle2" className="h-5 w-5 text-cyan-600" />
                Найдено {parsedData.length} транзакций
              </CardTitle>
              <Button onClick={handleImport} className="bg-cyan-500 hover:bg-cyan-600">
                <Icon name="Download" className="mr-2 h-4 w-4" />
                Импортировать всё
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedData.slice(0, 10).map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-cyan-100 text-cyan-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <Icon 
                        name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                        className="h-5 w-5" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-xs text-slate-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-cyan-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
              {parsedData.length > 10 && (
                <p className="text-center text-sm text-slate-500 py-2">
                  и ещё {parsedData.length - 10} транзакций...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Icon name="Info" className="h-5 w-5" />
            Как получить выписку из банка?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="font-semibold text-blue-900">Тинькофф:</p>
            <p className="text-sm text-blue-800">
              Приложение → История → Три точки → Сохранить выписку → CSV
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-blue-900">Сбербанк:</p>
            <p className="text-sm text-blue-800">
              СберБанк Онлайн → Карта → История → Экспорт → Excel или CSV
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-blue-900">Альфа-Банк:</p>
            <p className="text-sm text-blue-800">
              Приложение → Счёт → История → Выгрузить в файл → CSV
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportView;
