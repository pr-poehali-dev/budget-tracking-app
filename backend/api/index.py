import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для управления финансами: счета, категории, транзакции, статистика
    Поддерживает GET для получения данных и POST для создания записей
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('path', '/')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # GET /accounts - получить все счета
        if method == 'GET' and path == '/accounts':
            cur.execute('SELECT * FROM t_p20799998_budget_tracking_app.accounts ORDER BY id')
            accounts = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in accounts], default=str),
                'isBase64Encoded': False
            }
        
        # POST /accounts - создать счёт
        elif method == 'POST' and path == '/accounts':
            body = json.loads(event.get('body', '{}'))
            cur.execute(
                '''INSERT INTO t_p20799998_budget_tracking_app.accounts 
                   (name, type, balance, icon, color) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *''',
                (body['name'], body['type'], body.get('balance', 0), 
                 body.get('icon', 'Wallet'), body.get('color', 'from-slate-400 to-slate-600'))
            )
            account = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(account), default=str),
                'isBase64Encoded': False
            }
        
        # GET /categories - получить категории
        elif method == 'GET' and path == '/categories':
            params = event.get('queryStringParameters') or {}
            type_filter = params.get('type')
            
            if type_filter:
                cur.execute(
                    'SELECT * FROM t_p20799998_budget_tracking_app.categories WHERE type = %s ORDER BY id',
                    (type_filter,)
                )
            else:
                cur.execute('SELECT * FROM t_p20799998_budget_tracking_app.categories ORDER BY id')
            
            categories = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in categories], default=str),
                'isBase64Encoded': False
            }
        
        # POST /categories - создать категорию
        elif method == 'POST' and path == '/categories':
            body = json.loads(event.get('body', '{}'))
            cur.execute(
                '''INSERT INTO t_p20799998_budget_tracking_app.categories 
                   (name, icon, color, type) 
                   VALUES (%s, %s, %s, %s) RETURNING *''',
                (body['name'], body['icon'], body['color'], body['type'])
            )
            category = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(category), default=str),
                'isBase64Encoded': False
            }
        
        # GET /transactions - получить транзакции
        elif method == 'GET' and path == '/transactions':
            params = event.get('queryStringParameters') or {}
            type_filter = params.get('type')
            
            query = '''
                SELECT t.*, c.name as category_name, c.icon as category_icon, 
                       a.name as account_name
                FROM t_p20799998_budget_tracking_app.transactions t
                LEFT JOIN t_p20799998_budget_tracking_app.categories c ON t.category_id = c.id
                LEFT JOIN t_p20799998_budget_tracking_app.accounts a ON t.account_id = a.id
            '''
            
            if type_filter:
                query += ' WHERE t.type = %s'
                cur.execute(query + ' ORDER BY t.date DESC, t.id DESC', (type_filter,))
            else:
                cur.execute(query + ' ORDER BY t.date DESC, t.id DESC')
            
            transactions = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in transactions], default=str),
                'isBase64Encoded': False
            }
        
        # POST /transactions - создать транзакцию
        elif method == 'POST' and path == '/transactions':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute(
                '''INSERT INTO t_p20799998_budget_tracking_app.transactions 
                   (type, amount, category_id, account_id, date, description) 
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING *''',
                (body['type'], body['amount'], body['category_id'], 
                 body['account_id'], body.get('date'), body.get('description', ''))
            )
            transaction = cur.fetchone()
            
            amount_change = float(body['amount'])
            if body['type'] == 'expense':
                amount_change = -amount_change
            
            cur.execute(
                'UPDATE t_p20799998_budget_tracking_app.accounts SET balance = balance + %s WHERE id = %s',
                (amount_change, body['account_id'])
            )
            
            conn.commit()
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(transaction), default=str),
                'isBase64Encoded': False
            }
        
        # GET /statistics - получить статистику
        elif method == 'GET' and path == '/statistics':
            params = event.get('queryStringParameters') or {}
            period = params.get('period', 'month')
            
            interval_map = {'day': '1 day', 'week': '7 days', 'month': '30 days'}
            interval = interval_map.get(period, '30 days')
            
            cur.execute(f'''
                SELECT 
                    SUM(CASE WHEN type = ''income'' THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN type = ''expense'' THEN amount ELSE 0 END) as total_expense,
                    COUNT(*) as transaction_count
                FROM t_p20799998_budget_tracking_app.transactions
                WHERE date >= CURRENT_DATE - INTERVAL '{interval}'
            ''')
            
            stats = dict(cur.fetchone())
            stats['balance'] = (stats['total_income'] or 0) - (stats['total_expense'] or 0)
            
            cur.execute(f'''
                SELECT c.name, c.color, SUM(t.amount) as total
                FROM t_p20799998_budget_tracking_app.transactions t
                JOIN t_p20799998_budget_tracking_app.categories c ON t.category_id = c.id
                WHERE t.type = 'expense' AND t.date >= CURRENT_DATE - INTERVAL '{interval}'
                GROUP BY c.id, c.name, c.color
                ORDER BY total DESC
                LIMIT 10
            ''')
            
            stats['top_expenses'] = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(stats, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not found'}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
