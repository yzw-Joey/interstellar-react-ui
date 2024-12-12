const { declare } = require('@babel/helper-plugin-utils');

const autoReactIntlPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);
  return {
    visitor: {
      Program(path) {
        let index = 0;
        const messages = [];
        path.traverse({
          ImportDeclaration(p) {
            index++;
          },
          VariableDeclaration(p) {
            if (p.node.declarations[0]?.init.type === 'StringLiteral') {
              const variableName = p.node.declarations[0]?.init.value;
              messages.push(variableName);
              const replacedAst = api.template.ast(
                `intl.formatMessage(messages['${variableName}'])`
              );
              p.node.declarations[0].init = replacedAst.expression;
              //   p.node.declarations[0]?.init = replacedAst.expression;
            }
            if (p.node.declarations[0]?.init.type === 'ArrayExpression') {
              const elements = p.node.declarations[0]?.init.elements;

              elements.forEach((e, idx) => {
                if (e.type === 'StringLiteral') {
                  const variableName = e.value;
                  messages.push(e.value);
                  const replacedAst = api.template.ast(
                    `intl.formatMessage(messages['${variableName}'])`
                  );
                  elements[idx] = replacedAst.expression;
                  // elements[idx] = replacedAst.expression;
                }
              });
            }
          },
        });

        const importAst = api.template.ast(
          `import { defineMessage, useIntl } from 'react-intl'`
        );
        path.node.body.splice(index++, 0, importAst);
        messages.forEach((m) => {
          options.messages.add(m);
        });

        const messageAst = api.template.ast(
          `const messages = defineMessage({
              ${messages
                .map(
                  (m) => `"${m}": {
                id:'${m}'
              }`
                )
                .join(',')}
            })`
        );

        path.node.body.splice(index, 0, messageAst);
      },
    },
  };
});

module.exports = autoReactIntlPlugin;
