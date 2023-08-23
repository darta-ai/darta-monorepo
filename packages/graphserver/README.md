Designing a basic Express.js server that connects to an ArangoDB database can be done following best practices and design patterns that promote maintainability and scalability. Here's how you might approach it:

1. Separation of Concerns:
To maintain a clean architecture, it's essential to separate different parts of the application into well-defined layers:

Routes: Define the API endpoints or URL patterns and map them to the corresponding controllers.

Controllers: Implement the business logic that handles user input, invokes the appropriate services, and returns responses.

Services: Encapsulate interactions with the ArangoDB database, including CRUD operations and any complex queries.

Models: Represent the data structure and validation for the documents stored in ArangoDB.

2. Use Middleware:
Express.js is built on middleware functions that have access to the request object, response object, and the next function in the application’s request-response cycle. You can utilize middleware for various purposes such as logging, authentication, validation, etc.

3. Connection Management:
Create a separate module for managing the connection to ArangoDB. You might use an ODM (Object Document Mapper) like arangojs that provides a higher-level API to interact with ArangoDB. This module will handle connection pooling, reconnecting, etc.

4. Error Handling:
Implement a robust error-handling mechanism to catch and respond to different types of errors appropriately. This includes database errors, validation errors, authentication errors, and more.

5. Environment Configuration:
Use environment variables to manage different configurations for development, testing, and production environments. It allows for more secure and flexible configuration management.

6. Testing:
Write unit tests for controllers and services to ensure that they behave correctly. Integration tests might be employed to test the full flow of particular routes.

Example Structure:
/routes: All the route definitions.
/controllers: The logic for handling route requests.
/services: Interaction with ArangoDB.
/models: Data models and validation.
/middlewares: Custom middleware functions.
/config: Configuration files, like database connection settings.
/tests: Unit and integration tests.
Conclusion:
This design pattern is aligned with the common practices in developing Express.js applications, and it promotes clean and maintainable code. By separating concerns into different layers and adhering to the principles of modular design, it becomes easier to develop, test, and scale the application. Additionally, integrating best practices in error handling, configuration management, and testing will lead to a more robust and reliable system.