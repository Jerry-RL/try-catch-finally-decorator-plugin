const babel = require("@babel/core");
const plugin = require("../src/index");

function transformCode(code) {
  return babel.transformSync(code, {
    plugins: [plugin],
    configFile: false,
  }).code;
}

describe("try-catch-finally-decorator-plugin", () => {
  test("Wraps function with try-catch-finally", () => {
    const input = `
// @tryCatchFinally catch { console.error("Custom Error:", error); } finally { console.log("Function ended."); }
function fetchData() {
  const data = JSON.parse('{ invalid json }');
  console.log(data);
}`;

    const output = transformCode(input);

    expect(output).toContain("try {");
    expect(output).toContain("catch (error)");
    expect(output).toContain("console.error(\"Custom Error:\", error);");
    expect(output).toContain("finally { console.log(\"Function ended.\"); }");
  });

  test("Does not modify functions without @tryCatchFinally", () => {
    const input = `function processData() { return 42; }`;
    const output = transformCode(input);

    expect(output).not.toContain("try {");
    expect(output).toBe(input);
  });
});
