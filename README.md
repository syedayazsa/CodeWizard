# 🧙‍♂️ CodeWizard

CodeWizard is a Visual Studio Code extension that leverages a custom Language Server Protocol (LSP) server and an optional middleware API to integrate large language model (LLM) functionalities directly into your editor. This project enables advanced features such as dynamic code completion, hover-based explanations, and context-aware code actions by querying external LLM providers.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Building the Extension](#building-the-extension)
  - [Testing and Debugging](#testing-and-debugging)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CodeWizard is an open source VS Code extension designed to empower developers with LLM-powered capabilities during software development. By integrating a custom language server with VS Code's Language Client, the extension provides real-time code completions, detailed hover information, and context-aware code actions by querying external LLM services via a middleware API. The project is implemented entirely in TypeScript and adheres to modern software engineering practices.

---

## Features

- **Selective Activation:** Activates only on workspaces containing a `.vscode/extensions.json` file.
- **Code Completion:** Provides dynamic completion suggestions based on document context.
- **Hover Information:** Displays detailed explanations and documentation for symbols.
- **LLM Integration:** Queries an external LLM (via a middleware API) to generate context-aware responses.
- **Configuration:** Supports user customization for API keys, preferred LLM models, and other settings.
- **Robust Error Handling:** Gracefully handles API errors and request cancellations.
- **Modular Architecture:** Separates the VS Code client, LSP server, and middleware API into distinct modules for maintainability and extensibility.

---

## Architecture

The diagram depicts three main components in the architecture:

1. **VS Code Client (Extension)**
    - This is a standard VS Code extension that users install.
    - Inside the extension, there is a "Language Client" that starts up and communicates with the custom language server.
    - The extension can also have UI components such as command palette items, a webview, or a status bar.
    - Developers configure credentials and LLM settings here.

2. **Custom Language Server**
    - The Language Server implements the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) in TypeScript.
    - It manages document synchronization (opening, closing, changes) and has specialized handlers for:
        - **OnCompletion**: Provide code completion suggestions (e.g., from an LLM).
        - **OnHover**: Return code explanations or docstrings.
        - **OnCodeAction**: For generating tests, refactoring suggestions, etc.
        - **Diagnostics**: If the LLM can identify potential issues, it can be reported as diagnostics.
    - The server also does runtime logging, parsing the code (possibly using an AST or text-based parsing) before sending queries to the LLM.
3. **Middleware API**
    - This layer is effectively an **Express API Gateway** that your language server calls.
    - Responsibilities include:
        - **Prompt Engineering**: Combining user input + context from the code to craft the final LLM prompt.
        - **Rate Limiting**: Avoid flooding your LLM provider with too many requests.
        - **Security / Auth**: If you need to handle tokens or credentials.
    - The LLM itself can be an external service (OpenAI, Anthropic, etc).

Below is a high-level diagram of the system
![CodeWizard Architecture](./misc/codewizard.png)
---

## Functional Requirements

1. **Extension Activation and Client Initialization:**  
   - Activate the extension only when a file matching the pattern (e.g. `.vscode/extensions.json`) is opened.  
   - Start a language client that communicates with the custom language server via IPC.

2. **Document Synchronization:**  
   - Synchronize text documents between VS Code and the language server using full or incremental sync.

3. **Code Completion and Hover:**  
   - Provide context-aware code completion suggestions.  
   - Support hover requests to display detailed information.

4. **LLM Querying:**  
   - Dispatch LLM requests (via middleware) with a properly formatted prompt containing document context.  
   - Support request cancellation and error handling.

5. **Configuration:**  
   - Allow user configuration for API keys, model selection, and timeout values via VS Code settings.

6. **Error Handling and Logging:**  
   - Log significant events and errors to assist in troubleshooting.  
   - Provide user-friendly error messages.

---

## Non-Functional Requirements

1. **Performance:**  
   - Respond to completion and hover requests within 500 milliseconds under normal conditions.  
   - Use incremental document synchronization to minimize processing overhead.

2. **Scalability and Extensibility:**  
   - Support future integration with additional LLM providers and language features.  
   - Maintain modular, loosely coupled components.

3. **Reliability:**  
   - Handle middleware API failures and cancellation requests gracefully without crashing.

4. **Security:**  
   - Ensure secure communication with middleware APIs using HTTPS and proper authentication.  
   - Store sensitive information securely in VS Code settings.

5. **Maintainability:**  
   - Adhere to strict TypeScript best practices.  
   - Provide comprehensive documentation and clear module separation.

6. **Compatibility:**  
   - Be compatible with supported versions of Visual Studio Code as specified in the documentation.  
   - Conform to the VS Code Language Server Protocol.

---

## Installation

### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** or **Yarn**
- **Visual Studio Code** (latest stable release)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/syedayazsa/CodeWizard.git
   cd CodeWizard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build all packages:
   ```bash
   npm run build
   ```

### Server (Language Server)

1. Navigate to the server directory:
   ```bash
   cd ../server
   npm install
   npm run build
   ```

### Middleware (Optional)

1. Navigate to the middleware directory:
   ```bash
   cd ../middleware
   npm install
   npm run build
   ```

---

## Usage

1. Open Visual Studio Code.
2. Open a workspace that contains a `.vscode/extensions.json` file.
3. The extension will activate automatically.
4. Use the standard code completion and hover features within the target file.
5. To test LLM-powered completions, trigger completion in a JSON value (for example, within the recommendations array). The extension queries the external LLM via the middleware and returns suggestions.

---

## Configuration

User-configurable settings are available via VS Code's settings UI under the `codeWizard` namespace. Examples include:

- **codeWizard.apiKey:** Your API key for the LLM provider.
- **codeWizard.model:** Preferred LLM model identifier.
- **codeWizard.requestTimeout:** Timeout for LLM requests (in milliseconds).

These settings are automatically passed from the language client to the language server on initialization and when updated.

---

## Development

### Project Structure

```
/CodeWizard
  /packages
    /extension       // VS Code extension (Language Client)
      ├── src/
      │    └── extension.ts
      ├── package.json
      └── tsconfig.json
    /language-server // Language Server (LSP Server)
      ├── src/
      │    └── server.ts
      ├── package.json
      └── tsconfig.json
    /middleware-api  // Middleware API for LLM queries
      ├── src/
      │    └── index.ts
      ├── package.json
      └── tsconfig.json
  package.json      // Root-level configuration with workspaces
```

### Building the Extension

Each component has its own build script. For example, run:
```bash
# For the client
cd client && npm run build

# For the server
cd ../server && npm run build
```
If using Yarn workspaces, a root-level build script can coordinate building all packages.

### Testing and Debugging

- **Unit Tests:**  
  Write unit tests using Jest or Mocha in each package's test directory.
  
- **Integration Tests:**  
  Use VS Code's Extension Development Host to launch and interact with your extension.
  
- **Debugging:**  
  Use a `.vscode/launch.json` configuration in the client package to start the extension in debug mode.

---

## Contributing

Contributions are welcome! Please follow these guidelines:
- Fork the repository and create a feature branch.
- Ensure all code is written in TypeScript and follows the project's coding standards.
- Write unit and integration tests for new features.
- Update documentation and the CHANGELOG as needed.
- Submit a pull request describing your changes.

For more detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

CodeWizard is maintained by the open source community. If you have any questions or need assistance, please open an issue.
