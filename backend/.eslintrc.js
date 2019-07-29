module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "linebreak-style": ["error", process.env.NODE_ENV === "prod" ? "unix" : "unix"],
        "max-len": [
            "error", {
                "code": 140
            }
        ],
        "indent": ["error", 4],
        "allowMultiplePropertiesPerLine": true,
        "no-unused-vars": "warn",
        "no-unused-expressions": "warn",
        "prefer-promise-reject-errors": "off",
        "no-param-reassign": "warn",
        "class-methods-use-this": "warn",
    },
    "env": {
        "jasmine": true,
        "browser": true,
        "node": true,
        "mocha": true
    }
};
