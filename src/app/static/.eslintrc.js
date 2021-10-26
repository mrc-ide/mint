module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/essential"
    ],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "comma-dangle": ["error", "never"],
        "quotes": ["error", "double", {"avoidEscape": true}],
        "no-prototype-builtins": "off",
        // this is just a rule to enforce nesting script tags in vue templates
        // unfortunately it doesn't understand typescript AST so won't enforce any other
        // code indentation rules in Vue script tags
        // https://eslint.vuejs.org/rules/script-indent.html
        "vue/script-indent": ["error", 4, {
            "baseIndent": 1,
            "ignores": [
                // nested objects, excluding top level of exported object (data, methods, computed, etc.)
                "[value.type='ObjectExpression']:not(:matches(ExportDefaultDeclaration, [left.property.name='exports']) > * > [value.type='ObjectExpression'])",
                // nested arrays
                "[value.type='ArrayExpression']"
            ]
        }]
    }
};