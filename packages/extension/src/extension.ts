// src/extension.ts
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Path to the compiled language server
  const serverModule = path.join(
    context.extensionPath,
    '..',  // up one folder to packages
    'language-server', 
    'out',
    'server.js'
  );

  // The debug/run options for the server
  const serverOptions: ServerOptions = {
    run:   { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc }
  };

  // Options for the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' }
    ]
    // ... additional config ...
  };

  // Create and start the client
  const client = new LanguageClient('myLanguageServer', 'My Language Server', serverOptions, clientOptions);
  client.start();

  // Register a simple command for demonstration
  const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from my extension!');
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Clean up if necessary
}

