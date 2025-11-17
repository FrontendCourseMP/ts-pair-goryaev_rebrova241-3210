"use strict";
var MathExpression = /** @class */ (function () {
    function MathExpression(expression) {
        this.originalExpression = expression;
    }
    MathExpression.prototype.cleanExpression = function () {
        return this.originalExpression.replace(/[^\d+\-*/().\s]/g, '');
    };
    MathExpression.prototype.validate = function () {
        var cleaned = this.cleanExpression();
        if (cleaned.trim().length === 0) {
            return {
                status: 'invalid',
                message: 'Выражение не может быть пустым'
            };
        }
        var bracketCount = 0;
        for (var _i = 0, cleaned_1 = cleaned; _i < cleaned_1.length; _i++) {
            var char = cleaned_1[_i];
            if (char === '(')
                bracketCount++;
            if (char === ')')
                bracketCount--;
            if (bracketCount < 0) {
                return {
                    status: 'invalid',
                    message: 'Несбалансированные скобки'
                };
            }
        }
        if (bracketCount !== 0) {
            return {
                status: 'invalid',
                message: 'Несбалансированные скобки'
            };
        }
        return { status: 'valid', message: '' };
    };
    MathExpression.prototype.getExpression = function () {
        return this.originalExpression;
    };
    MathExpression.prototype.getCleanedExpression = function () {
        return this.cleanExpression();
    };
    return MathExpression;
}());
