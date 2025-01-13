# React + Vite Setup

This template provides a minimal and fast setup to get React running with Vite, featuring Hot Module Replacement (HMR) for efficient development and integrated ESLint rules for maintaining code quality.

## Features:

- **Fast Refresh**: Updates your React components instantly without losing state.
- **Optimized Development**: Vite leverages native ES modules to provide a lightning-fast development environment.
- **ESLint**: Pre-configured rules to enforce coding standards and catch errors early.

## Official Plugins:

Two official Vite plugins are available for React development:

1. **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)**  
   Uses **Babel** for Fast Refresh. This is the default React plugin and provides a full-featured setup for React development, including support for JSX, TypeScript, and more.

2. **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)**  
   Uses **SWC** (Speedy Web Compiler) for Fast Refresh, offering faster performance during development. SWC is a Rust-based compiler and is an alternative to Babel with a focus on speed.

## Setup

### Prerequisites:

Ensure that you have [Node.js](https://nodejs.org/) version 16.8 or higher installed.

### Installation:

# Clone the repository

git clone https://github.com/hoangphuc2905/fe_group05_kttkpm.git
cd your-repository-name

# Install dependencies

npm install

# Run the development server

npm run dev

# If you prefer to use SWC for Fast Refresh:

npm install @vitejs/plugin-react-swc

# Update vite.config.js to use SWC instead of Babel

# Edit vite.config.js file:

# import { defineConfig } from 'vite';

# import react from '@vitejs/plugin-react-swc'; # Use SWC plugin

# Export configuration:

export default defineConfig({
plugins: [react()],
});
