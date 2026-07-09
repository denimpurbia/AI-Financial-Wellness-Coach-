"""
Supabase client initialization and utilities
"""
from supabase import create_client, Client
from config import Config
from typing import Optional, Dict, Any, List

class SupabaseClient:
    """Wrapper for Supabase client with utility methods"""
    
    _instance: Optional[Client] = None
    
    @classmethod
    def init(cls) -> Client:
        """Initialize Supabase client"""
        if cls._instance is None:
            cls._instance = create_client(
                Config.SUPABASE_URL,
                Config.SUPABASE_ANON_KEY
            )
        return cls._instance
    
    @classmethod
    def get(cls) -> Client:
        """Get initialized Supabase client"""
        if cls._instance is None:
            cls.init()
        return cls._instance

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return SupabaseClient.get()

# Database table names
TABLES = {
    'users': 'users',
    'expenses': 'expenses',
    'budgets': 'budgets',
    'goals': 'goals',
    'chat_history': 'chat_history',
    'challenges': 'challenges_completed',
    'user_preferences': 'user_preferences',
    'predictions': 'spending_predictions',
}

class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    @staticmethod
    def _handle_error(error: Any, context: str = "") -> Dict[str, Any]:
        """Handle database errors"""
        error_msg = str(error)
        return {
            'success': False,
            'error': error_msg,
            'context': context
        }
    
    # User Operations
    def get_user(self, user_id: str) -> Dict[str, Any]:
        """Fetch user data"""
        try:
            response = self.supabase.table(TABLES['users']).select('*').eq('id', user_id).single().execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'get_user')
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new user"""
        try:
            response = self.supabase.table(TABLES['users']).insert(user_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'create_user')
    
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user data"""
        try:
            response = self.supabase.table(TABLES['users']).update(user_data).eq('id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'update_user')
    
    # Expense Operations
    def create_expense(self, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new expense"""
        try:
            response = self.supabase.table(TABLES['expenses']).insert(expense_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'create_expense')
    
    def get_user_expenses(self, user_id: str, limit: int = 100) -> Dict[str, Any]:
        """Fetch all expenses for a user"""
        try:
            response = self.supabase.table(TABLES['expenses']).select('*').eq('user_id', user_id).order('date', desc=True).limit(limit).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'get_user_expenses')
    
    def delete_expense(self, expense_id: str, user_id: str) -> Dict[str, Any]:
        """Delete an expense"""
        try:
            response = self.supabase.table(TABLES['expenses']).delete().eq('id', expense_id).eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'delete_expense')
    
    def update_expense(self, expense_id: str, user_id: str, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an expense"""
        try:
            response = self.supabase.table(TABLES['expenses']).update(expense_data).eq('id', expense_id).eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'update_expense')
    
    # Budget Operations
    def create_budget(self, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new budget"""
        try:
            response = self.supabase.table(TABLES['budgets']).insert(budget_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'create_budget')
    
    def get_user_budgets(self, user_id: str) -> Dict[str, Any]:
        """Fetch all budgets for a user"""
        try:
            response = self.supabase.table(TABLES['budgets']).select('*').eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'get_user_budgets')
    
    def update_budget(self, budget_id: str, user_id: str, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update budget"""
        try:
            response = self.supabase.table(TABLES['budgets']).update(budget_data).eq('id', budget_id).eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'update_budget')
    
    # Chat History Operations
    def save_chat_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save chat message to history"""
        try:
            response = self.supabase.table(TABLES['chat_history']).insert(message_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'save_chat_message')
    
    def get_chat_history(self, user_id: str, limit: int = 50) -> Dict[str, Any]:
        """Fetch chat history for user"""
        try:
            response = self.supabase.table(TABLES['chat_history']).select('*').eq('user_id', user_id).order('created_at', desc=True).limit(limit).execute()
            return {'success': True, 'data': list(reversed(response.data))}  # Return in chronological order
        except Exception as e:
            return self._handle_error(e, 'get_chat_history')
    
    # Goals Operations
    def create_goal(self, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new goal"""
        try:
            response = self.supabase.table(TABLES['goals']).insert(goal_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'create_goal')
    
    def get_user_goals(self, user_id: str) -> Dict[str, Any]:
        """Fetch all goals for user"""
        try:
            response = self.supabase.table(TABLES['goals']).select('*').eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'get_user_goals')
    
    # Challenges Completed Operations
    def add_completed_challenge(self, challenge_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mark challenge as completed"""
        try:
            response = self.supabase.table(TABLES['challenges']).insert(challenge_data).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'add_completed_challenge')
    
    def get_user_challenges(self, user_id: str) -> Dict[str, Any]:
        """Fetch completed challenges for user"""
        try:
            response = self.supabase.table(TABLES['challenges']).select('*').eq('user_id', user_id).execute()
            return {'success': True, 'data': response.data}
        except Exception as e:
            return self._handle_error(e, 'get_user_challenges')
