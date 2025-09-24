-- Insert test users (password is 'password123' for all users)
INSERT INTO users (id, email, password, name, role, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'CLIENT', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 'LAWYER', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Johnson', 'LAWYER', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.wilson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Wilson', 'CLIENT', CURRENT_TIMESTAMP);

-- Insert test lawyers
INSERT INTO lawyers (id, specialization, experience, verified, hourly_rate) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Criminal Law', '10 years', true, 150.00),
('550e8400-e29b-41d4-a716-446655440003', 'Family Law', '8 years', true, 120.00);

-- Insert test clients
INSERT INTO clients (id, phone, address) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '+1234567890', '123 Main St, City'),
('550e8400-e29b-41d4-a716-446655440004', '+0987654321', '456 Oak Ave, Town');

-- Insert test consultations
INSERT INTO consultations (id, client_id, lawyer_id, scheduled_at, status) VALUES 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 10:00:00', 'PENDING'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '2024-01-16 14:00:00', 'CONFIRMED'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-01-10 09:00:00', 'COMPLETED');
