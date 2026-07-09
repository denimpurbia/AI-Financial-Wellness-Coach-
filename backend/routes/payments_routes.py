"""
Payment routes - handles payment processing and transactions
"""
from flask import Blueprint, request, jsonify
from auth import require_auth
from supabase_client import DatabaseService
from datetime import datetime

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')
db = DatabaseService()

VALID_PAYMENT_METHODS = ['bank', 'upi', 'card', 'qr']
VALID_CATEGORIES = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']


@payments_bp.route('/process', methods=['POST'])
@require_auth
def process_payment(user_id):
    """
    Process a payment transaction
    
    Request body:
    {
        "amount": 250.50,
        "category": "Food",
        "purpose": "Lunch",
        "payment_method": "upi",
        "notes": "Optional notes"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amount', 'category', 'purpose', 'payment_method']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400
        
        # Validate category
        if data['category'] not in VALID_CATEGORIES:
            return jsonify({'error': f'Invalid category. Must be one of: {VALID_CATEGORIES}'}), 400
        
        # Validate payment method
        if data['payment_method'] not in VALID_PAYMENT_METHODS:
            return jsonify({'error': f'Invalid payment method. Must be one of: {VALID_PAYMENT_METHODS}'}), 400
        
        # Validate amount
        try:
            amount = float(data['amount'])
            if amount <= 0:
                return jsonify({'error': 'Amount must be greater than 0'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid amount format'}), 400
        
        # Prepare transaction data
        transaction_data = {
            'user_id': user_id,
            'amount': amount,
            'category': data['category'],
            'description': data['purpose'],
            'payment_method': data['payment_method'],
            'notes': data.get('notes', ''),
            'date': datetime.now().isoformat().split('T')[0],
            'status': 'completed',
            'created_at': 'now()',
        }
        
        # Create expense record (using existing expenses table)
        result = db.create_expense(transaction_data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Payment processed successfully',
                'transaction': result['data'],
                'timestamp': datetime.now().isoformat()
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to process payment')
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Payment processing error: {str(e)}'
        }), 500


@payments_bp.route('/transactions', methods=['GET'])
@require_auth
def get_transactions(user_id):
    """Get all transactions (payments) for the user"""
    try:
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        category = request.args.get('category', None)
        
        result = db.get_user_expenses(user_id, limit=limit)
        
        if result['success']:
            transactions = result['data']
            
            # Filter by category if provided
            if category:
                transactions = [t for t in transactions if t.get('category') == category]
            
            return jsonify({
                'success': True,
                'transactions': transactions,
                'count': len(transactions),
                'limit': limit,
                'offset': offset
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/transactions/<transaction_id>', methods=['GET'])
@require_auth
def get_transaction_detail(user_id, transaction_id):
    """Get details of a specific transaction"""
    try:
        # Fetch from database
        result = db.get_expense(transaction_id, user_id)
        
        if result['success']:
            return jsonify({
                'success': True,
                'transaction': result['data']
            }), 200
        else:
            return jsonify({'error': 'Transaction not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/transactions/<transaction_id>', methods=['PUT'])
@require_auth
def update_transaction(user_id, transaction_id):
    """Update a transaction"""
    try:
        data = request.get_json()
        
        # Validate category if provided
        if 'category' in data and data['category'] not in VALID_CATEGORIES:
            return jsonify({'error': f'Invalid category. Must be one of: {VALID_CATEGORIES}'}), 400
        
        # Validate payment method if provided
        if 'payment_method' in data and data['payment_method'] not in VALID_PAYMENT_METHODS:
            return jsonify({'error': f'Invalid payment method. Must be one of: {VALID_PAYMENT_METHODS}'}), 400
        
        result = db.update_expense(transaction_id, user_id, data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Transaction updated',
                'transaction': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/summary', methods=['GET'])
@require_auth
def get_payment_summary(user_id):
    """Get payment summary and statistics"""
    try:
        result = db.get_user_expenses(user_id, limit=1000)
        
        if not result['success']:
            return jsonify({'error': result['error']}), 400
        
        transactions = result['data']
        
        if not transactions:
            return jsonify({
                'success': True,
                'summary': {
                    'total_amount': 0,
                    'transaction_count': 0,
                    'by_category': {},
                    'by_payment_method': {},
                    'average_transaction': 0
                }
            }), 200
        
        # Calculate summary
        total_amount = sum(t['amount'] for t in transactions)
        
        # By category
        by_category = {}
        for t in transactions:
            cat = t.get('category', 'Other')
            by_category[cat] = by_category.get(cat, 0) + t['amount']
        
        # By payment method
        by_payment_method = {}
        for t in transactions:
            method = t.get('payment_method', 'unknown')
            by_payment_method[method] = by_payment_method.get(method, 0) + t['amount']
        
        average_transaction = total_amount / len(transactions) if transactions else 0
        
        summary = {
            'total_amount': float(total_amount),
            'transaction_count': len(transactions),
            'by_category': by_category,
            'by_payment_method': by_payment_method,
            'average_transaction': float(average_transaction),
            'currency': 'INR'
        }
        
        return jsonify({
            'success': True,
            'summary': summary
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get list of valid expense categories"""
    return jsonify({
        'categories': VALID_CATEGORIES
    }), 200


@payments_bp.route('/methods', methods=['GET'])
def get_payment_methods():
    """Get list of valid payment methods"""
    return jsonify({
        'payment_methods': [
            {'id': 'bank', 'label': 'Bank Account'},
            {'id': 'upi', 'label': 'UPI'},
            {'id': 'card', 'label': 'Credit Card'},
            {'id': 'qr', 'label': 'QR Payment'}
        ]
    }), 200
