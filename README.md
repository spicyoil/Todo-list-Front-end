# Vue.js Web Application Example Todo list Front-end

This is a modern Vue.js 3 frontend application example that demonstrates a basic web application setup with Vite.

## Project Description

This project creates a responsive single-page application using Vue.js 3 and Vite. The application demonstrates Vue's component structure, reactivity system, and styling capabilities. The development server listens on port 3000 and provides hot module replacement for a smooth development experience.

## Environment

This project runs on a Debian 12 system with Node.js and Vue.js 3.4.29, which is pre-configured in the Devbox environment. You don't need to worry about setting up Node.js, npm, or Vue dependencies yourself. The development environment includes all necessary tools for building and running Vue applications, including Vite for fast development and optimized builds. If you need to make adjustments to match your specific requirements, you can modify the configuration files accordingly.

## Project Execution

**Development mode:** run `npm run dev` 

**Production mode:** After release, the project will be automatically packaged into a Docker image and deployed according to the `entrypoint.sh` script with production parameters (run `bash entrypoint.sh production`). This will build optimized static files and serve them using Vite's preview server.
