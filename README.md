# babel-plugin-try-catch-finally-decorator

A Babel plugin that automatically wraps functions with `try-catch-finally` when annotated with `@tryCatchFinally`.

## Installation

```sh
npm install babel-plugin-try-catch-finally-decorator --save-dev
```

### Usage
Add to .babelrc or babel.config.js

```json
{
  "plugins": ["babel-plugin-try-catch-finally-decorator"]
}
```

### Example Code

Before Transformation

```js
// @tryCatchFinally catch { console.error("Error:", error); } finally { console.log("Done"); }
function fetchData() {
  const data = JSON.parse('{ invalid json }');
  console.log(data);
}
```
After Transformation

```js
function fetchData() {
  try {
    const data = JSON.parse('{ invalid json }');
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Done");
  }
}
```