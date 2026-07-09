"""
Goals and Challenges routes
"""
from flask import Blueprint, request, jsonify
from auth import require_auth
from supabase_client import DatabaseService

goals_bp = Blueprint('goals', __name__, url_prefix='/api/goals')
db = DatabaseService()

@goals_bp.route('', methods=['GET'])
@require_auth
def get_goals(user_id):
    """Get all goals for user"""
    try:
        result = db.get_user_goals(user_id)
        
        if result['success']:
            return jsonify({'goals': result['data']}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@goals_bp.route('', methods=['POST'])
@require_auth
def create_goal(user_id):
    """Create new financial goal"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'target_amount', 'category']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        goal_data = {
            'user_id': user_id,
            'name': data['name'],
            'description': data.get('description', ''),
            'target_amount': float(data['target_amount']),
            'current_amount': float(data.get('current_amount', 0)),
            'category': data['category'],
            'deadline': data.get('deadline', None),
            'status': 'active',
            'created_at': 'now()',
        }
        
        result = db.create_goal(goal_data)
        
        if result['success']:
            return jsonify(result['data']), 201
        else:
            return jsonify({'error': result['error']}), 400
    
    except ValueError:
        return jsonify({'error': 'Invalid amount format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Challenges routes
challenges_bp = Blueprint('challenges', __name__, url_prefix='/api/challenges')

AVAILABLE_CHALLENGES = [
    {
        'id': 'no-spend-weekend',
        'name': 'No-Spend Weekend',
        'description': 'Complete a weekend without spending money',
        'reward_xp': 30,
        'difficulty': 'easy'
    },
    {
        'id': 'home-cooking-5days',
        'name': '5 Days Home Cooking',
        'description': 'Cook at home for 5 consecutive days',
        'reward_xp': 50,
        'difficulty': 'medium'
    },
    {
        'id': 'no-cab-week',
        'name': 'One Week No Cab',
        'description': 'Use public transport for a full week',
        'reward_xp': 25,
        'difficulty': 'medium'
    },
    {
        'id': 'no-shopping-week',
        'name': 'No Online Shopping',
        'description': 'Avoid online shopping for 7 days',
        'reward_xp': 40,
        'difficulty': 'hard'
    },
    {
        'id': 'budget-tracker-30days',
        'name': '30-Day Budget Tracker',
        'description': 'Track every expense for 30 days',
        'reward_xp': 100,
        'difficulty': 'hard'
    },
]

@challenges_bp.route('', methods=['GET'])
@require_auth
def get_available_challenges(user_id):
    """Get available challenges"""
    return jsonify({'challenges': AVAILABLE_CHALLENGES}), 200

@challenges_bp.route('/completed', methods=['GET'])
@require_auth
def get_completed_challenges(user_id):
    """Get completed challenges for user"""
    try:
        result = db.get_user_challenges(user_id)
        
        if result['success']:
            return jsonify({'completed_challenges': result['data']}), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@challenges_bp.route('/complete', methods=['POST'])
@require_auth
def complete_challenge(user_id):
    """Mark challenge as completed"""
    try:
        data = request.get_json()
        
        if 'challenge_id' not in data:
            return jsonify({'error': 'Challenge ID is required'}), 400
        
        challenge_id = data['challenge_id']
        
        # Find challenge to get reward
        challenge = next((c for c in AVAILABLE_CHALLENGES if c['id'] == challenge_id), None)
        
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404
        
        challenge_data = {
            'user_id': user_id,
            'challenge_id': challenge_id,
            'challenge_name': challenge['name'],
            'reward_xp': challenge['reward_xp'],
            'completed_at': 'now()',
        }
        
        result = db.add_completed_challenge(challenge_data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': f"Challenge '{challenge['name']}' completed!",
                'reward_xp': challenge['reward_xp'],
                'data': result['data']
            }), 201
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@challenges_bp.route('/stats', methods=['GET'])
@require_auth
def get_challenge_stats(user_id):
    """Get challenge completion statistics"""
    try:
        result = db.get_user_challenges(user_id)
        
        if not result['success']:
            return jsonify({'error': result['error']}), 400
        
        completed = result['data']
        total_xp = sum(c.get('reward_xp', 0) for c in completed)
        
        return jsonify({
            'total_challenges_completed': len(completed),
            'total_xp_earned': total_xp,
            'challenges': completed
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
