"""
Main Flask application
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config, get_config
from supabase_client import SupabaseClient

# Import routes
from routes.auth_routes import auth_bp
from routes.expenses_routes import expenses_bp
from routes.payments_routes import payments_bp
from routes.chat_routes import chat_bp
from routes.budget_routes import budget_bp
from routes.goals_challenges_routes import goals_bp, challenges_bp

def create_app(config=None):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    if config is None:
        config = get_config()
    app.config.from_object(config)
    
    # Validate configuration
    try:
        Config.validate_config()
    except ValueError as e:
        print(f"Configuration Error: {e}")
        print("Please make sure all required environment variables are set in .env file")
        raise
    
    # Initialize Supabase
    SupabaseClient.init()
    
    # Setup CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', ['http://localhost:5173']),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(challenges_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'service': 'AI Financial Wellness Coach Backend',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/api', methods=['GET'])
    def api_root():
        return jsonify({
            'message': 'API Financial Wellness Coach API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'expenses': '/api/expenses',
                'payments': '/api/payments',
                'budget': '/api/budget',
                'chat': '/api/chat',
                'goals': '/api/goals',
                'challenges': '/api/challenges'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    host = os.getenv('HOST', 'localhost')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', False)
    
    print(f"\n{'='*60}")
    print("AI Financial Wellness Coach - Backend Server")
    print(f"{'='*60}")
    print(f"Starting server on http://{host}:{port}")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"\nAPI Documentation:")
    print(f"  Health Check: GET http://{host}:{port}/api/health")
    print(f"  API Root: GET http://{host}:{port}/api")
    print(f"\n{'='*60}\n")
    
    app.run(host=host, port=port, debug=debug)
