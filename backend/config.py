import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', False)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    # OpenRouter Configuration
    OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
    AI_MODEL = os.getenv('AI_MODEL', '~openai/gpt-latest')
    AI_MAX_TOKENS = int(os.getenv('AI_MAX_TOKENS', 1000))
    AI_TEMPERATURE = float(os.getenv('AI_TEMPERATURE', 0.7))
    OPENROUTER_HTTP_REFERER = os.getenv('OPENROUTER_HTTP_REFERER', 'http://localhost:5173')
    OPENROUTER_APP_TITLE = os.getenv('OPENROUTER_APP_TITLE', 'AI Financial Wellness Coach')
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Database
    DATABASE_SCHEMA = os.getenv('DATABASE_SCHEMA', 'public')
    
    @staticmethod
    def validate_config():
        """Validate that all required configurations are set"""
        required_keys = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY',
            'OPENROUTER_API_KEY'
        ]
        
        missing_keys = [key for key in required_keys if not getattr(Config, key)]
        
        if missing_keys:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_keys)}")

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True

def get_config(env=None):
    """Get configuration based on environment"""
    env = env or os.getenv('FLASK_ENV', 'development')
    
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig,
    }
    
    return config_map.get(env, DevelopmentConfig)
