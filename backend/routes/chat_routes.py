"""
Chatbot and AI routes
"""
from flask import Blueprint, request, jsonify
from auth import get_auth_service, extract_token_from_header
from ai_service import get_ai_service
from supabase_client import DatabaseService

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')
db = DatabaseService()
ai_service = get_ai_service()

@chat_bp.route('/message', methods=['POST'])
def send_message():
    """Send message to AI chatbot and get response"""
    try:
        data = request.get_json(silent=True) or {}

        token = extract_token_from_header()
        user_id = None
        if token:
            user_id = get_auth_service().verify_token(token)
            if not user_id:
                return jsonify({'success': False, 'error': 'Invalid or expired token'}), 401
        
        if 'message' not in data or not str(data['message']).strip():
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        language = data.get('language', 'english')
        
        # Get user context for better AI responses
        user_context = {}
        if user_id:
            user_result = db.get_user(user_id)
            expenses_result = db.get_user_expenses(user_id, limit=100)

            if user_result['success']:
                user_data = user_result['data']
                user_context['current_score'] = user_data.get('financial_health_score', 50)

            if expenses_result['success']:
                expenses = expenses_result['data']
                if expenses:
                    total = sum(e['amount'] for e in expenses)
                    user_context['total_expenses'] = total

                    categories = {}
                    for exp in expenses:
                        cat = exp['category']
                        categories[cat] = categories.get(cat, 0) + exp['amount']

                    if categories:
                        user_context['top_category'] = max(categories, key=categories.get)
        
        # Get AI response
        ai_response = ai_service.generate_response(
            message=user_message,
            user_context=user_context,
            language=language
        )
        
        if ai_response['success']:
            if user_id:
                message_data = {
                    'user_id': user_id,
                    'user_message': user_message,
                    'ai_response': ai_response['response'],
                    'language': language,
                    'created_at': 'now()',
                }
                db.save_chat_message(message_data)
            
            return jsonify({
                'success': True,
                'response': ai_response['response'],
                'language': language,
                'model': ai_response.get('model'),
                'authenticated': bool(user_id)
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': ai_response.get('error', 'Failed to generate response')
            }), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
@require_auth
def get_chat_history(user_id):
    """Get chat history for user"""
    try:
        limit = request.args.get('limit', 50, type=int)
        result = db.get_chat_history(user_id, limit=limit)
        
        if result['success']:
            return jsonify({'history': result['data']}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/analyze', methods=['POST'])
@require_auth
def analyze_financial_situation(user_id):
    """Get AI analysis of user's financial situation"""
    try:
        # Get user expenses
        expenses_result = db.get_user_expenses(user_id, limit=100)
        
        if not expenses_result['success']:
            return jsonify({'error': 'Could not fetch expenses'}), 400
        
        expenses = expenses_result['data']
        
        # Get AI analysis
        analysis = ai_service.analyze_expenses(expenses)
        
        return jsonify(analysis), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/suggestions', methods=['GET'])
@require_auth
def get_ai_suggestions(user_id):
    """Get AI-powered financial suggestions"""
    try:
        language = request.args.get('language', 'english')
        
        # Get user data for context
        user_result = db.get_user(user_id)
        expenses_result = db.get_user_expenses(user_id, limit=100)
        
        context = {}
        if user_result['success']:
            context['current_score'] = user_result['data'].get('financial_health_score', 50)
        
        if expenses_result['success']:
            expenses = expenses_result['data']
            if expenses:
                total = sum(e['amount'] for e in expenses)
                context['total_expenses'] = total
        
        # Build prompt for suggestions
        prompt = "Based on my financial data, what are your top 3 recommendations for me to save more money and improve my financial health?"
        
        # Get AI response
        ai_response = ai_service.generate_response(
            message=prompt,
            user_context=context,
            language=language
        )
        
        if ai_response['success']:
            return jsonify({
                'suggestions': ai_response['response'],
                'language': language
            }), 200
        else:
            return jsonify({'error': ai_response.get('error')}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
