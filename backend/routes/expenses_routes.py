"""
Expense routes
"""
from flask import Blueprint, request, jsonify
from auth import require_auth
from supabase_client import DatabaseService
from datetime import datetime

expenses_bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')
db = DatabaseService()

@expenses_bp.route('', methods=['GET'])
@require_auth
def get_expenses(user_id):
    """Get all expenses for user"""
    try:
        limit = request.args.get('limit', 100, type=int)
        result = db.get_user_expenses(user_id, limit=limit)
        
        if result['success']:
            return jsonify({'expenses': result['data']}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expenses_bp.route('', methods=['POST'])
@require_auth
def create_expense(user_id):
    """Create new expense"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amount', 'category', 'description']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        expense_data = {
            'user_id': user_id,
            'amount': float(data['amount']),
            'category': data['category'],
            'description': data['description'],
            'date': data.get('date', datetime.now().isoformat().split('T')[0]),
            'created_at': 'now()',
        }
        
        result = db.create_expense(expense_data)
        
        if result['success']:
            return jsonify(result['data']), 201
        else:
            return jsonify({'error': result['error']}), 400
    
    except ValueError:
        return jsonify({'error': 'Invalid amount format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expenses_bp.route('/<expense_id>', methods=['PUT'])
@require_auth
def update_expense(user_id, expense_id):
    """Update expense"""
    try:
        data = request.get_json()
        
        result = db.update_expense(expense_id, user_id, data)
        
        if result['success']:
            return jsonify(result['data']), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expenses_bp.route('/<expense_id>', methods=['DELETE'])
@require_auth
def delete_expense(user_id, expense_id):
    """Delete expense"""
    try:
        result = db.delete_expense(expense_id, user_id)
        
        if result['success']:
            return jsonify({'message': 'Expense deleted'}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expenses_bp.route('/analytics', methods=['GET'])
@require_auth
def get_expense_analytics(user_id):
    """Get expense analytics and summary"""
    try:
        result = db.get_user_expenses(user_id, limit=1000)
        
        if not result['success']:
            return jsonify({'error': result['error']}), 400
        
        expenses = result['data']
        
        # Calculate analytics
        total = sum(e['amount'] for e in expenses)
        
        # By category
        by_category = {}
        for expense in expenses:
            cat = expense['category']
            by_category[cat] = by_category.get(cat, 0) + expense['amount']
        
        # By month (last 12 months)
        by_month = {}
        for expense in expenses:
            month = expense['date'][:7]  # YYYY-MM format
            by_month[month] = by_month.get(month, 0) + expense['amount']
        
        analytics = {
            'total_expenses': total,
            'average_per_expense': total / len(expenses) if expenses else 0,
            'by_category': by_category,
            'by_month': by_month,
            'expense_count': len(expenses),
        }
        
        return jsonify(analytics), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
