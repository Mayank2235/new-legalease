# LegalEase Backend

Spring Boot backend for the LegalEase legal services platform.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

## Setup

### 1. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE legalease;
```

2. Update `src/main/resources/application.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/legalease
    username: your_username
    password: your_password
```

### 2. JWT Configuration

Update the JWT secret in `application.yml`:
```yaml
jwt:
  secret: your-very-long-and-secure-secret-key-here
  expiration: 3600000  # 1 hour in milliseconds
```

## Running the Application

### Development Mode
```bash
mvn spring-boot:run
```

### Build and Run
```bash
mvn clean package
java -jar target/legalease-backend-1.0.0.jar
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user (CLIENT or LAWYER)
- `POST /login` - Authenticate and get JWT token
- `POST /logout` - Logout (placeholder)

### Lawyers (`/api/lawyers`)
- `GET /` - List all lawyers
- `GET /{id}` - Get lawyer by ID
- `POST /` - Create lawyer profile
- `PUT /{id}` - Update lawyer profile
- `PATCH /{id}/verify` - Verify lawyer (admin only)

### Clients (`/api/clients`)
- `GET /{id}` - Get client profile
- `POST /` - Create client profile
- `PUT /{id}` - Update client profile

### Consultations (`/api/consultations`)
- `POST /` - Book a consultation
- `GET /client/{id}` - Get consultations for a client
- `GET /lawyer/{id}` - Get consultations for a lawyer
- `PATCH /{id}/status` - Update consultation status

## Security

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CSRF disabled for API usage

## Testing with Postman

### 1. Register a User
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

### 2. Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Use JWT Token
```http
GET http://localhost:8080/api/lawyers
Authorization: Bearer <your-jwt-token>
```

## Database Schema

The application will automatically create the following tables:
- `users` - User accounts and authentication
- `lawyers` - Lawyer profiles and specializations
- `clients` - Client profiles and contact information
- `consultations` - Consultation bookings and status

## Project Structure

```
src/main/java/com/legalease/
├── LegalEaseApplication.java    # Main application class
├── controller/                  # REST controllers
├── service/                     # Business logic services
├── repository/                  # Data access layer
├── entity/                      # JPA entities
├── dto/                         # Data transfer objects
└── security/                    # Security configuration
```

## Dependencies

- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- JWT (Java JWT)
- Lombok
- Validation

## Notes

- The application uses `hibernate.ddl-auto: update` which will automatically create/update database tables
- JWT tokens expire after 1 hour by default
- All API endpoints (except `/api/auth/**`) require authentication
- CORS is enabled for all origins (configure appropriately for production)











