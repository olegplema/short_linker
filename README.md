# Short Linker

Short Linker is a serverless application that provides URL shortening functionality, allowing users to create and manage shortened links easily. This project is built using AWS Lambda, AWS DynamoDB, AWS Simple Queue Service (SQS), and AWS Simple Email Service (SES).

## Project Structure

The project structure is organized as follows:

- **src/:** Contains the source code for the application.
- **dist/:** The output directory for the compiled code.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node.js package manager)

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/olegplema/short_linker.git
   cd short_linker
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Build the Project:**

   ```bash
   npm run build
   ```

4. **Deploy the Application:**

   ```bash
   serverless deploy
   ```

## Configuration

Update the `serverless.yml` file with your AWS credentials, region, verified email address and other necessary configurations. Ensure your AWS credentials are properly configured on your local machine.

**Update configuration in `serverless.yml`:**

   ```yaml
   environment:
     ...
     EMAIL: "your-email@example.com"  # Update with the verified email address
     REGION: "your-aws-region"  # Update with your AWS region
   ```

## Usage

### API Endpoints

- **Create Shortened Link:**
    - **Endpoint:** `POST /links/create`
    - **Description:** Create a shortened link by providing the original URL.

- **Deactivate Shortened Link:**
    - **Endpoint:** `POST /links/deactivate`
    - **Description:** Deactivate a previously created shortened link.

- **List Shortened Links:**
    - **Endpoint:** `GET /links/list`
    - **Description:** Retrieve a list of all active shortened links.

- **Follow Shortened Link:**
    - **Endpoint:** `GET /:id`
    - **Description:** Redirect to the original URL associated with the provided short link ID.

- **Sign In:**
    - **Endpoint:** `POST /auth/sign-in`
    - **Description:** Authenticate and obtain an access token.

- **Sign Up:**
    - **Endpoint:** `POST /auth/sign-up`
    - **Description:** Create a new user account.

### Authentication

Authentication is required for certain endpoints. Refer to the API documentation for details on obtaining and using authentication tokens.
