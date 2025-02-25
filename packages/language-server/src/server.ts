// src/server.ts
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  InitializeParams,
  InitializeResult,
  CompletionItem,
  CompletionItemKind
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// The workspace folder this server is operating on
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;
  hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Incremental
      },
      completionProvider: {
        resolveProvider: true
      }
    }
  };
  return result;
});

// Provide completion items
connection.onCompletion((_textDocumentPosition) => {
  // For demo, always return a single item
  return [
    {
      label: 'HelloWorld',
      kind: CompletionItemKind.Text,
      data: 1
    }
  ];
});

// Resolve additional info for the completion item
connection.onCompletionResolve((item: CompletionItem) => {
  if (item.data === 1) {
    item.detail = 'Hello World detail';
    item.documentation = 'This is a hello world completion from the server.';
  }
  return item;
});

// Make the text document manager listen on the connection
documents.listen(connection);
// Listen on the connection
connection.listen();
