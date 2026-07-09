"""
Budget routes
"""
from flask import Blueprint, request, jsonify
from auth import require_auth
from supabase_client import DatabaseService

budget_bp = Blueprint('budget', __name__, url_prefix='/api/budget')
db = DatabaseService()

@budget_bp.route('', methods=['GET'])
@require_auth
def get_budgets(user_id):
    """Get all budgets for user"""
    try:
        result = db.get_user_budgets(user_id)
        
        if result['success']:
            return jsonify({'budgets': result['data']}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('', methods=['POST'])
@require_auth
def create_budget(user_id):
    """Create new budget"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['category', 'limit_amount', 'period']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        budget_data = {
            'user_id': user_id,
            'category': data['category'],
            'limit_amount': float(data['limit_amount']),
            'period': data['period'],  # 'weekly', 'monthly', 'yearly'
            'description': data.get('description', ''),
            'created_at': 'now()',
        }
        
        result = db.create_budget(budget_data)
        
        if result['success']:
            return jsonify(result['data']), 201
        else:
            return jsonify({'error': result['error']}), 400
    
    except ValueError:
        return jsonify({'error': 'Invalid amount format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<budget_id>', methods=['PUT'])
@require_auth
def update_budget(user_id, budget_id):
    """Update budget"""
    try:
        data = request.get_json()
        
        result = db.update_budget(budget_id, user_id, data)
        
        if result['success']:
            return jsonify(result['data']), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/status', methods=['GET'])
@require_auth
def get_budget_status(user_id):
    """Get budget status with spending information"""
    try:
        # Get budgets
        budgets_result = db.get_user_budgets(user_id)
        expenses_result = db.get_user_expenses(user_id, limit=1000)
        
        if not budgets_result['success'] or not expenses_result['success']:
            return jsonify({'error': 'Could not fetch data'}), 400
        
        budgets = budgets_result['data']
        expenses = expenses_result['data']
        
        # Calculate spending by category
        spending_by_category = {}
        for expense in expenses:
            cat = expense['category']
            spending_by_category[cat] = spending_by_category.get(cat, 0) + expense['amount']
        
        # Match with budgets and calculate status
        budget_status = []
        for budget in budgets:
            category = budget['category']
            limit_amount = budget['limit_amount']
            spent = spending_by_category.get(category, 0)
            remaining = limit_amount - spent
            percentage = (spent / limit_amount * 100) if limit_amount > 0 else 0
            
            status = 'good'
            if percentage > 100:
                status = 'exceeded'
            elif percentage > 80:
                status = 'warning'
            
            budget_status.append({
                'budget_id': budget['id'],
                'category': category,
                'limit': limit_amount,
                'spent': spent,
                'remaining': remaining,
                'percentage': round(percentage, 2),
                'status': status
            })
        
        return jsonify({'budget_status': budget_status}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
