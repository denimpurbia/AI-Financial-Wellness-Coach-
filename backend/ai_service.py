"""
AI Service for OpenRouter API integration
"""
import requests
from typing import Dict, List, Any, Optional
from config import Config
from supabase_client import DatabaseService

class AIService:
    """Service for AI operations using OpenRouter"""
    
    API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
    
    def __init__(self):
        self.api_key = Config.OPENROUTER_API_KEY
        self.model = Config.AI_MODEL
        self.max_tokens = Config.AI_MAX_TOKENS
        self.temperature = Config.AI_TEMPERATURE
        self.db = DatabaseService()
    
    def generate_response(
        self, 
        message: str, 
        user_context: Optional[Dict[str, Any]] = None,
        language: str = 'english',
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generate AI response for financial advice
        
        Args:
            message: User's question/message
            user_context: User's financial context (expenses, budget, etc.)
            language: Language preference (english, hindi, hinglish, mewadi)
            conversation_history: Previous messages in conversation
        
        Returns:
            Dictionary with AI response and metadata
        """
        try:
            if not self.api_key:
                return {
                    'success': False,
                    'error': 'OpenRouter API key is not configured'
                }

            # Build system prompt with financial context
            system_prompt = self._build_system_prompt(language, user_context)
            
            # Build messages
            messages = list(conversation_history) if conversation_history else []
            messages.append({
                "role": "user",
                "content": message
            })
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": Config.OPENROUTER_HTTP_REFERER,
                "X-OpenRouter-Title": Config.OPENROUTER_APP_TITLE,
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    *messages
                ],
                "temperature": self.temperature,
                "max_tokens": self.max_tokens,
            }
            
            last_response = None
            for attempt in range(2):
                response = requests.post(
                    self.API_ENDPOINT,
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                last_response = response

                if response.status_code == 200:
                    data = response.json()
                    choice = data.get('choices', [{}])[0]
                    ai_message = choice.get('message', {}).get('content')

                    if not ai_message:
                        return {
                            'success': False,
                            'error': 'OpenRouter response did not include a message'
                        }

                    return {
                        'success': True,
                        'response': ai_message,
                        'language': language,
                        'model': self.model,
                        'usage': data.get('usage', {})
                    }

                if response.status_code not in {429, 500, 502, 503, 504} or attempt == 1:
                    break

            return {
                'success': False,
                'error': f"OpenRouter API error: {last_response.status_code if last_response else 'unknown'}",
                'details': self._extract_error_message(last_response)
            }
        
        except requests.Timeout:
            return {
                'success': False,
                'error': 'API request timeout'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    @staticmethod
    def _extract_error_message(response: Optional[requests.Response]) -> str:
        if response is None:
            return 'No response received from OpenRouter'

        try:
            data = response.json()
            if isinstance(data, dict):
                if 'error' in data:
                    error_value = data['error']
                    if isinstance(error_value, dict):
                        return error_value.get('message') or error_value.get('code') or response.text
                    return str(error_value)
                if 'message' in data:
                    return str(data['message'])
        except Exception:
            pass

        return response.text or 'OpenRouter request failed'
    
    def _build_system_prompt(
        self, 
        language: str, 
        user_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Build system prompt with language and context"""
        
        language_instructions = {
            'english': """You are Obsidian AI, an intelligent financial assistant for students.
- Provide practical financial advice focused on saving and budgeting
- Use friendly, encouraging tone
- Give specific amounts and percentages when possible
- Include emoji for visual appeal: ⬡ 👋 📊 💰 🎯 📈 🏆 🔮
- Provide actionable tips and challenges
- Always suggest concrete savings opportunities
- Be supportive and non-judgmental about spending""",
            
            'hindi': """आप Obsidian AI हैं, छात्रों के लिए एक बुद्धिमान वित्तीय सहायक।
- बचत और बजट पर केंद्रित व्यावहारिक वित्तीय सलाह दें
- दोस्ताना, प्रोत्साहक स्वर का उपयोग करें
- जब संभव हो तो विशिष्ट राशि और प्रतिशत दें
- दृश्य अपील के लिए इमोजी का उपयोग करें: ⬡ 👋 📊 💰 🎯 📈 🏆 🔮
- कार्रवाई योग्य सुझाव और चुनौतियाँ दें
- ठोस बचत के अवसर सुझाएं
- खर्च के बारे में सहायक और निष्पक्ष रहें""",
            
            'hinglish': """Tum Obsidian AI ho, students ke liye intelligent financial assistant.
- Practical financial advice do jo saving aur budgeting par focus kare
- Friendly aur encouraging tone use karo
- Jab possible ho to specific amounts aur percentages do
- Visual appeal ke liye emoji use karo: ⬡ 👋 📊 💰 🎯 📈 🏆 🔮
- Actionable tips aur challenges do
- Concrete savings opportunities suggest karo
- Supportive aur non-judgmental raho spending ke baare mein""",
            
            'mewadi': """Tum Obsidian AI ho, vidyarthiyon ke liye intelligent arthik sahayak.
- Vyavaharik arthik salah do jo bachat aur budget par bhavvan kare
- Mitravarti aur protsahit svara use karo
- Jab sambhav ho to vishisht rashmi aur pratishat do
- Drishy akarshan ke liye emoji use karo: ⬡ 👋 📊 💰 🎯 📈 🏆 🔮
- Karyavah sujhav aur chunautiyan do
- Thos bachat ke avasar sujhao
- Kharcho ke baare mein sahayak aur nirpeksh raho"""
        }
        
        base_prompt = language_instructions.get(language, language_instructions['english'])
        
        # Add user context if available
        context_info = ""
        if user_context:
            if 'current_score' in user_context:
                context_info += f"\nUser's Financial Health Score: {user_context['current_score']}/100"
            
            if 'total_expenses' in user_context:
                context_info += f"\nTotal Monthly Expenses: ₹{user_context['total_expenses']}"
            
            if 'top_category' in user_context:
                context_info += f"\nHighest Spending Category: {user_context['top_category']}"
            
            if 'savings_potential' in user_context:
                context_info += f"\nPotential Monthly Savings: ₹{user_context['savings_potential']}"
        
        return base_prompt + context_info
    
    def analyze_expenses(self, expenses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze user expenses and provide insights"""
        if not expenses:
            return {
                'success': True,
                'analysis': 'No expenses to analyze',
                'insights': []
            }
        
        # Calculate totals by category
        category_totals = {}
        total_spent = 0
        
        for expense in expenses:
            category = expense.get('category', 'Other')
            amount = expense.get('amount', 0)
            
            category_totals[category] = category_totals.get(category, 0) + amount
            total_spent += amount
        
        # Find insights
        insights = []
        
        # Identify highest spending category
        if category_totals:
            highest_category = max(category_totals, key=category_totals.get)
            highest_amount = category_totals[highest_category]
            percentage = (highest_amount / total_spent * 100) if total_spent > 0 else 0
            
            if percentage > 30:
                insights.append({
                    'type': 'warning',
                    'category': highest_category,
                    'message': f"{highest_category} is {percentage:.1f}% of your spending - consider reducing this"
                })
        
        return {
            'success': True,
            'total_spent': total_spent,
            'category_breakdown': category_totals,
            'insights': insights
        }

# Singleton instance
_ai_service = None

def get_ai_service() -> AIService:
    """Get AI service instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
