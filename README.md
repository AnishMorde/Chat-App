VibeRoom

A real-time chat application backend built with Spring Boot, WebSocket, and MongoDB.

## Features

- Real-time messaging using WebSocket
- Create and join chat rooms
- Message persistence using MongoDB
- Paginated message history
- Cross-origin support for frontend integration

## Tech Stack

- Java 17
- Spring Boot 3.4.2
- Spring WebSocket
- Spring Data MongoDB
- MongoDB 5.0
- Docker
- Maven

## Prerequisites

- Java 17 or higher
- MongoDB 5.0
- Docker (optional)
- Maven 3.x

## Configuration

### MongoDB Configuration

The application uses MongoDB as its database. Configuration can be found in `application.properties`:

```properties
spring.data.mongodb.uri = mongodb://localhost:27017/chatApp
spring.data.mongodb.port = 27017
spring.data.mongodb.database = journalAppDB
spring.data.mongodb.username = myUsername
spring.data.mongodb.password = myPass
```

### WebSocket Configuration

WebSocket is configured in [`WebConfigSocket.java`](src/main/java/com/chatApp/chatapp/config/WebConfigSocket.java) with:
- Message broker enabled at `/topic`
- Application destination prefix at `/app`
- STOMP endpoint at `/chat`

### Frontend URL Configuration

Frontend URL is configured in [`AppConstants.java`](src/main/java/com/chatApp/chatapp/config/AppConstants.java):
```java
public static final String FRONT_END_BASE_URL = "http://localhost:5173";
```

## API Endpoints

### Room Management

- **Create Room**
  - POST `/api/v1/rooms`
  - Body: roomId (String)

- **Join Room**
  - GET `/api/v1/rooms/{roomId}`

- **Get Room Messages**
  - GET `/api/v1/rooms/{roomId}/messages`
  - Query Parameters:
    - page (default: 0)
    - size (default: 20)

### WebSocket Endpoints

- **Send Message**
  - Destination: `/app/sendMessage/{roomId}`
  - Subscription: `/topic/room/{roomId}`
  - Payload: MessageRequest (content, sender, roomId, msgTime)

## Running the Application

### Using Maven

```bash
./mvnw spring-boot:run
```

### Using Docker

1. Build the application:
```bash
./mvnw clean package
```

2. Run using Docker Compose:
```bash
docker-compose up
```

The application will be available at `http://localhost:8080`

## Docker Configuration

The application includes Docker support with:

- MongoDB container
- Spring Boot application container
- Docker network for container communication
- Volume for MongoDB data persistence

Docker Compose configuration can be found in `docker-compose.yml`

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/chatApp/chatapp/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── entity/
│   │       ├── payload/
│   │       └── repo/
│   └── resources/
│       └── application.properties
└── test/
    └── java/
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for
