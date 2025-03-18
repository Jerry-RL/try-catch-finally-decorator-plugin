module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "try-catch-finally-decorator-plugin",
    visitor: {
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(path) {
        const { node } = path;

        // Check for a leading comment with @tryCatchFinally
        const comments = path.parentPath.node.leadingComments || [];
        const decoratorComment = comments.find(comment =>
          comment.value.includes('@tryCatchFinally')
        );

        if (!decoratorComment) return;

        // Extract custom handlers from the comment
        let catchHandler = 'console.error(error);';
        let finallyHandler = '';

        const commentText = decoratorComment.value;

        // Match catch block handler
        const catchMatch = commentText.match(/@tryCatchFinally\s*catch\s*\{([\s\S]*?)\}/);
        if (catchMatch) catchHandler = catchMatch[1].trim();

        // Match finally block handler
        const finallyMatch = commentText.match(/@tryCatchFinally\s*finally\s*\{([\s\S]*?)\}/);
        if (finallyMatch) finallyHandler = finallyMatch[1].trim();

        // Ensure function body is a block statement
        if (!t.isBlockStatement(node.body)) {
          node.body = t.blockStatement([t.returnStatement(node.body)]);
        }

        // Create try-catch-finally block
        const tryStatement = t.tryStatement(
          t.blockStatement(node.body.body),
          t.catchClause(
            t.identifier('error'),
            t.blockStatement(babel.parse(`{${catchHandler}}`).program.body)
          ),
          finallyHandler ? t.blockStatement(babel.parse(`{${finallyHandler}}`).program.body) : null
        );

        // Replace function body
        node.body.body = [tryStatement];
      }
    }
  };
};
