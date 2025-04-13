# Darta: Contemporary Art Discovery Platform

Darta is a full-stack application that revolutionizes how people discover and engage with contemporary art. By combining a Tinder-style mobile interface with a powerful gallery management system, Darta bridges the gap between art galleries and potential buyers.

## 🚀 Portfolio Project

This portfolio project demonstrates my full-stack development capabilities, with particular focus on:
- Modern **React Native** and **Next.js** front-end development
- **GraphQL API** design and implementation
- **TypeScript** for type safety across the entire application
- **ArangoDB** graph database management 
- Monorepo management with **pnpm**

## 🎨 Overview

Darta consists of two main interfaces:
- **Mobile App**: A React Native application where users swipe through artwork to indicate preferences, building a personalized taste profile
- **Gallery Portal**: A Next.js web application where galleries can manage their inventory and view analytics on user engagement

The system uses machine learning to continuously improve recommendations based on user interactions and preferences.

## 🏗️ Architecture

This monorepo is organized into the following packages:

```
darta/
├── packages/
│   ├── darta/              # React Native mobile application
│   ├── darta-types/        # Shared TypeScript interfaces and types
│   ├── darta-styles/       # Shared styling and theming
│   ├── next/               # Next.js web application for galleries
│   └── graphserver/        # GraphQL API server with ArangoDB
```

## ✨ Features

### Mobile App
- Tinder-style swipe interface for artwork discovery
- Personalized recommendations based on user preferences
- Gallery and exhibition locator with maps integration
- Artist and artwork details with rich media support
- Favorite collection and sharing capabilities

### Gallery Portal
- Inventory management system
- Artwork upload and management
- Analytics dashboard showing user engagement
- Exhibition planning and promotion tools
- Integration with gallery CRM systems

### Server
- GraphQL API for efficient data fetching
- ArangoDB for flexible graph data storage
- Authentication and authorization system
- Analytics processing and recommendation engine
- Real-time data synchronization

## 🚀 Technology Stack

- **Frontend**:
  - React Native for mobile
  - Next.js for web
  - Apollo Client for GraphQL
  - Styled Components with shared design system

- **Backend**:
  - Node.js with Express
  - GraphQL for API
  - ArangoDB for database
  - JWT for authentication

- **DevOps**:
  - Docker for containerization
  - GitHub Actions for CI/CD
  - AWS for hosting

## 🛠️ Development Environment

This project uses **pnpm** as the package manager for efficient dependency management across the monorepo architecture. The monorepo structure enables code sharing and consistent development practices across all components of the application.

Key development considerations:
- Typescript ensures type safety across the entire application
- Shared types and styles maintain consistency between web and mobile interfaces
- GraphQL schema is the single source of truth for data structures
- Containerized development environment for consistent testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Plans

- Art marketplace functionality
- Artist-specific portfolios and direct messaging
- Gallery event ticketing and RSVP system
- International expansion and localization

---

Built with ❤️ by [TJ Wetmore]