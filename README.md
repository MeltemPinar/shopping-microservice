# shopping-microservice

# Başlangıç komutu

npm init --y && npm i express cors dotenv && npm i nodemon -D

This project is a Node.js application functioning as an API Gateway in a microservices architecture. It is built using Express and several key libraries. The API Gateway acts as a central hub that proxies requests to different backend microservices, enabling seamless communication between them.

This project uses Node.js and the following dependencies:

cors: Middleware to enable Cross-Origin Resource Sharing (CORS) for the application.

dotenv: Loads environment variables from a .env file into process.env.

express: Web framework for building the API Gateway.

express-http-proxy: Middleware for proxying HTTP requests to other servers.

In development, the following package is used:

nodemon: Automatically restarts the application when file changes are detected.

#API Endpoints

The API Gateway proxies requests to different backend microservices:

Customer Service: Proxies requests to http://localhost:3001 under the /customer path.

Shopping Service: Proxies requests to http://localhost:3003 under the /shopping path.

Products Service: Proxies requests to http://localhost:3002 under the root path /.

