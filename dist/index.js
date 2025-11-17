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
        var operatorRegex = /[+\-*/]{2,}/;
        if (operatorRegex.test(cleaned)) {
            return {
                status: 'invalid',
                message: 'Некорректное использование операторов (несколько подряд)'
            };
        }
        return { status: 'valid', message: '' };
    };
    MathExpression.prototype.calculate = function () {
        var validation = this.validate();
        if (validation.status === 'invalid') {
            return {
                status: 'error',
                error: validation.message
            };
        }
        var cleanedExpression = this.cleanExpression();
        try {
            var result = new Function("return ".concat(cleanedExpression))();
            if (typeof result !== 'number' || !isFinite(result)) {
                return {
                    status: 'error',
                    error: 'Некорректный результат вычисления'
                };
            }
            return {
                status: 'success',
                value: result
            };
        }
        catch (error) {
            return {
                status: 'error',
                error: 'Ошибка при вычислении выражения'
            };
        }
    };
    return MathExpression;
}());
