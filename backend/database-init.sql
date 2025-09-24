-- LegalEase Database Initialization Script
-- PostgreSQL Database Schema

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS case_requests CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS lawyers CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('CLIENT', 'LAWYER', 'ADMIN');
CREATE TYPE consultation_status AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED');
CREATE TYPE case_status AS ENUM ('ACTIVE', 'PENDING', 'COMPLETED', 'CLOSED', 'CANCELLED');
CREATE TYPE case_type AS ENUM ('CRIMINAL', 'CIVIL', 'FAMILY', 'CORPORATE', 'REAL_ESTATE', 'PERSONAL_INJURY', 'EMPLOYMENT', 'IMMIGRATION', 'TAX', 'INTELLECTUAL_PROPERTY', 'OTHER');
CREATE TYPE request_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create lawyers table
CREATE TABLE lawyers (
    id UUID PRIMARY KEY,
    specialization VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    hourly_rate DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY,
    department VARCHAR(255) NOT NULL,
    permissions TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create consultations table
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    lawyer_id UUID NOT NULL,
    scheduled_at TIMESTAMP(6) NOT NULL,
    status consultation_status NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create cases table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    lawyer_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status case_status NOT NULL DEFAULT 'ACTIVE',
    type case_type NOT NULL,
    hourly_rate DECIMAL(10,2),
    total_hours DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create case_requests table
CREATE TABLE case_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    lawyer_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type case_type NOT NULL,
    status request_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    case_id UUID,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_consultations_client_id ON consultations(client_id);
CREATE INDEX idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_lawyer_id ON cases(lawyer_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_case_requests_client_id ON case_requests(client_id);
CREATE INDEX idx_case_requests_lawyer_id ON case_requests(lawyer_id);
CREATE INDEX idx_case_requests_status ON case_requests(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_case_id ON messages(case_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Insert sample data (optional - for testing)

-- Sample Users
INSERT INTO users (id, name, email, password, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '$2a$10$dummy.hash.for.testing', 'CLIENT'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '$2a$10$dummy.hash.for.testing', 'LAWYER'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Admin User', 'admin@legalease.com', '$2a$10$dummy.hash.for.testing', 'ADMIN');

-- Sample Clients
INSERT INTO clients (id, phone, address) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '+1-555-0101', '123 Main St, City, State 12345');

-- Sample Lawyers
INSERT INTO lawyers (id, specialization, experience, verified, hourly_rate) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'Criminal Law', '5 years', true, 150.00);

-- Sample Admins
INSERT INTO admins (id, department, permissions) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'System Administration', 'ALL');

-- Sample Consultations
INSERT INTO consultations (client_id, lawyer_id, scheduled_at, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 10:00:00', 'PENDING');

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;

-- Verify tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Note: The application will automatically create all tables using JPA/Hibernate
-- This script is provided as a manual alternative or for production deployments


