## jsxPen

Execute jsx code and share it with your colleagues. Execution of code is done by "esbuild-wasm". Wasm (web assembly) code defines an AST (Abstract Syntax Tree) represented in a binary format. Browsers understand the binary format, so we compile binary bundles that compress smaller than the text JavaScript we use today. Smaller payloads mean faster delivery. Depending on compile-time optimization opportunities, WebAssembly bundles may run faster than JavaScript, too!

## Bundling in javascript

`import React from "react"`

We want esbuild to transpile and bundle that code. Esbuild needs to look at the filesystem and try to find "react" dependency. But we are operating inside the browser and browser has no filesystem and it has no access to the underlying file system on our computer. We cannot write a javascript code that look into random files on your hard drive. So esbuild will throw an error. We have to intercept and tell esbuild via the plugins "do not look at the file system. we are going to reach out to npm, find the package and give it back to you".

Whenever esbuild sees importing npm packages, it reaches to "unpkg.com" which is a public cdn. It hosts all the source code that is hosted in npm.

## Executing code safely inside browser with iframe

iframe is used to embed one document into another. So we will have two different contexts to execute javascript. parent context and child context which is iframe. We take the user's code and execute it inside iframe.

- if we run javacript code inside iframe and somehing crashes, it is not problem becuase it is not executed in the same context as our react application.
- If user mutates the DOM in some fashion, they are going to mutate the DOM inside the iFrame, not our parent document, so user can mess around with the DOM as much as they please, and it is not going to do anything bad to our application.
- if we execute a user's code in an iframe with direct communication DISABLED, execution of malicious code wont effect our code.
