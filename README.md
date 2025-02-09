# Chat API

## Overview
This is a chat API built with Node.js and TypeScript. It allows users to:
- Register and log in
- Create and manage chat groups
- Send and receive messages
- Perform all necessary actions related to a chat application

The project includes unit tests and can be easily deployed using Docker.

## Features
- User authentication (register/login)
- Group chat creation and management
- Private and group messaging
- Unit-tested functionalities

## Installation
### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Running the API
You can quickly set up and run the API using Docker:
```
# Build the Docker image
docker build -t chat-api .

# Run the container
docker run -p 3000:3000 chat-api
```

## Running Tests
This project includes unit tests. To run them, use:
```
npm run test
```

## API Documentation
The API is documented using Swagger. Once the server is running, access the documentation at:
```
http://localhost:3000/api-docs
```
A static Swagger file (`swagger.json`) is also available in the project.

## Contributing
Feel free to submit issues or pull requests to improve the project.

## License
This project is licensed under the MIT License.

