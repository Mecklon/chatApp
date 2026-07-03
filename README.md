# Real-Time Chat Application 💬

A full-stack real-time messaging platform built with **Spring Boot** and **React**, supporting one-to-one conversations, group chats, multimedia messaging, online presence tracking, and low-latency communication through WebSockets.

The application combines **Spring Security**, **JWT Authentication**, **PostgreSQL**, and **Redis** to provide secure, scalable, and responsive messaging while maintaining a clear separation between real-time event delivery and historical data retrieval.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge\&logo=springsecurity\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge\&logo=jsonwebtokens)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-D82C20?style=for-the-badge\&logo=redis\&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge\&logo=framer)

---

# Screenshots

## Chat Window

*Coming Soon*

## Group Chat

*Coming Soon*

## Group Management

*Coming Soon*

---

# Tech Stack

## Backend

* Spring Boot
* Spring Security
* JWT Authentication
* WebSockets (STOMP)
* PostgreSQL
* Redis
* Spring Data JPA

## Frontend

* React
* Axios
* Tailwind CSS
* Framer Motion

---

# Features

### Messaging

* Real-time one-to-one messaging
* Real-time group conversations
* Audio sharing
* Video sharing
* Image sharing
* Message history
* Infinite chat pagination

### Presence

* Online / Offline status
* Last Seen timestamps
* Instant presence updates

### Message Status Tracking

* Sending
* Stored
* Delivered
* Read

### Group Management

* Create groups
* Promote members to administrators
* Remove members
* Update group profile
* Update group description
* Role-based permissions

### Security

* JWT-based authentication
* Spring Security authorization
* Protected REST endpoints
* Protected WebSocket connections

### Performance

* Redis-backed conversation caching
* Paginated message retrieval
* Reduced database load for frequently accessed chats

---

# Architecture

```text
React Client
        │
        ▼
REST API (Spring Boot)
        │
        ▼
WebSocket Broker
        │
        ▼
Redis Cache
        │
        ▼
PostgreSQL
```

The system separates real-time communication from historical data retrieval, allowing each protocol to be used where it performs best.

---

# Communication Strategy

The application intentionally uses both HTTP and WebSockets.

## HTTP

HTTP is used for request-response operations:

* Fetching historical messages
* Loading paginated chat history
* Creating groups
* Managing memberships
* Updating group information
* Authentication
* Media uploads

Conversation history retrieval follows:

```text
Client
    │
HTTP Request
    │
    ▼
Redis Cache
    │
Cache Miss
    ▼
PostgreSQL
    │
Cache Updated
    ▼
Client
```

Historical queries are stateless, cacheable, and efficient.

---

## WebSockets

WebSockets are used exclusively for real-time events:

* Incoming messages
* Group broadcasts
* Presence updates
* Last seen updates
* Delivery acknowledgements
* Read receipts

```text
Sender
    │
    ▼
Spring Boot
    │
Persist Message
    │
Update Cache
    │
Broadcast Event
    ▼
Connected Clients
```

This provides low-latency communication while avoiding unnecessary persistent connections for operations better suited to HTTP.

---

# WebSocket Room Architecture

The messaging system uses dedicated rooms for both private and group communication.

## Private Conversations

Every user automatically subscribes to a personal room after authentication.

```text
/topic/chat/{userId}
```

To send a private message, the server publishes directly to the recipient's room.

Only the intended recipient receives the event.

---

## Group Conversations

Each group maintains its own dedicated room.

```text
/topic/group/{groupId}
```

Group members automatically subscribe to all groups they belong to during login.

Sending a group message requires only a single broadcast to the group room.

```text
Sender
    │
    ▼
Group Room
    │
 ┌──┼──┬──┐
 ▼  ▼  ▼  ▼
U1 U2 U3 U4
```

This allows efficient message propagation without sending individual events to every member.

---

# Redis Caching Strategy

Frequently accessed conversations are cached using Redis.

When a user opens a conversation:

1. Redis is checked first.
2. Cached messages are returned immediately on a cache hit.
3. PostgreSQL is queried on a cache miss.
4. Results are written back to Redis.

```text
Conversation Opened
        │
        ▼
Check Redis
   │         │
Hit       Miss
 │          │
 ▼          ▼
Return    PostgreSQL
Cache        │
             ▼
      Update Redis
             │
             ▼
         Return Data
```

This significantly reduces repeated database queries for active conversations.

---

# Authentication & Authorization

Authentication is implemented using Spring Security and JWT.

The authentication flow:

```text
Login
   │
   ▼
Generate JWT
   │
   ▼
Client Stores Token
   │
   ▼
Authenticated Requests
```

The JWT filter validates requests before allowing access to protected resources.

---

# Role-Based Group Permissions

Groups support multiple permission levels.

## Member

Can:

* Send messages
* Receive messages
* View group information

## Administrator

Can:

* Promote members
* Remove members
* Modify group details
* Manage group membership

Administrative actions are protected through server-side authorization checks.

---

# Message Lifecycle

Messages progress through multiple states.

```text
Sending
   │
   ▼
Stored
   │
   ▼
Delivered
   │
   ▼
Read
```

The client UI reflects these transitions using message indicators.

### Supported States

* 🕒 Sending
* ✓ Stored
* ✓✓ Delivered
* 🔵✓✓ Read

---

# Presence System

User activity is tracked in real time.

Features include:

* Online status
* Offline status
* Last seen timestamps
* Presence synchronization through WebSockets

Connected users receive immediate presence updates without polling.

---

# Multimedia Messaging

Messages support rich media attachments.

Supported media types:

* Images
* Audio
* Video

Media metadata is associated with messages and rendered directly within conversations.

---

# Database Design

Core entities include:

* User
* Connection
* Group
* Message
* Multimedia
* Notification
* Friend Request

The schema separates user relationships, messaging data, media metadata, and notification management while supporting efficient conversation queries.

---

# Design Decisions

## Why Not Use WebSockets For Everything?

Although WebSockets support bidirectional communication, they are not ideal for every operation.

Historical conversations naturally fit the request-response model and benefit from:

* Stateless processing
* Pagination support
* Easier caching
* Simpler debugging
* Reduced WebSocket traffic

Real-time events such as incoming messages, presence updates, and read receipts require low latency and are therefore propagated through WebSockets.

Using the right protocol for each responsibility results in a simpler and more scalable architecture.

---

# Lessons Learned

Building this project provided experience with:

* WebSocket architecture
* Real-time messaging systems
* Redis caching strategies
* Spring Security
* JWT authentication
* Presence tracking
* Read receipt synchronization
* Room-based message routing
* PostgreSQL data modeling
* Role-based authorization
* Multimedia messaging
* Designing scalable chat systems

---

# Future Improvements

* Docker deployment
* Horizontal scaling
* Redis Pub/Sub
* Message reactions
* Typing indicators
* Push notifications
* Message search
* End-to-end encryption
* Voice calling
* Video calling

---

Made with ❤️ using Spring Boot and React.
