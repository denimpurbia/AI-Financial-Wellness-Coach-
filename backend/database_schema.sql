"""
Database schema setup script for Supabase
Run this SQL in your Supabase SQL editor to create all required tables
"""

-- SQL Schema for AI Financial Wellness Coach Backend
-- Execute this in your Supabase dashboard's SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Matches Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- References auth.users(id)
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    full_name VARCHAR(255),
    profile_photo TEXT,
    financial_health_score INT DEFAULT 50 CHECK (financial_health_score >= 0 AND financial_health_score <= 100),
    total_xp INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger Function to automatically create a user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, profile_photo)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    limit_amount DECIMAL(10, 2) NOT NULL CHECK (limit_amount > 0),
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(10, 2) DEFAULT 0 CHECK (current_amount >= 0),
    category VARCHAR(50),
    deadline DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'english',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Challenges completed table
CREATE TABLE IF NOT EXISTS challenges_completed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(100) NOT NULL,
    challenge_name VARCHAR(255),
    reward_xp INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(20) DEFAULT 'english',
    theme VARCHAR(20) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_alerts BOOLEAN DEFAULT TRUE,
    currency VARCHAR(5) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Spending predictions table
CREATE TABLE IF NOT EXISTS spending_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50),
    predicted_amount DECIMAL(10, 2),
    confidence DECIMAL(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
    time_period VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
CREATE INDEX idx_challenges_user_id ON challenges_completed(user_id);
CREATE INDEX idx_predictions_user_id ON spending_predictions(user_id);

-- Add Row Level Security (RLS) policies if needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges_completed ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users to only access their own data
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for expenses
CREATE POLICY "Users can view their own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for budgets
CREATE POLICY "Users can view their own budgets" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create budgets" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals" ON goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create goals" ON goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for chat history
CREATE POLICY "Users can view their own chat history" ON chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages" ON chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for challenges
CREATE POLICY "Users can view their own challenges" ON challenges_completed
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create challenge records" ON challenges_completed
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for predictions
CREATE POLICY "Users can view their own predictions" ON spending_predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Backend can create predictions" ON spending_predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
