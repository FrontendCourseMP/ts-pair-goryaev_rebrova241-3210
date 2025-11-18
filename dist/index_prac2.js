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
var CalculatorUI = /** @class */ (function () {
    function CalculatorUI() {
        this.form = document.getElementById('calculatorForm');
        this.expressionInput = document.getElementById('expression');
        this.errorMessage = document.getElementById('errorMessage');
        this.result = document.getElementById('result');
        this.clearBtn = document.getElementById('clearBtn');
        this.initializeEvents();
    }
    CalculatorUI.prototype.initializeEvents = function () {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.clearBtn.addEventListener('click', this.handleClear.bind(this));
        this.expressionInput.addEventListener('input', this.handleInput.bind(this));
    };
    CalculatorUI.prototype.handleSubmit = function (event) {
        event.preventDefault();
        var inputValue = this.expressionInput.value.trim();
        var mathExpression = new MathExpression(inputValue);
        var validation = mathExpression.validate();
        if (validation.status === 'invalid') {
            this.displayError(validation.message);
            return;
        }
        this.clearError();
        var calculation = mathExpression.calculate();
        this.displayResult(calculation);
    };
    CalculatorUI.prototype.handleClear = function () {
        this.expressionInput.value = '';
        this.clearError();
        this.clearResult();
        this.expressionInput.focus();
    };
    CalculatorUI.prototype.handleInput = function () {
        this.clearError();
    };
    CalculatorUI.prototype.displayError = function (message) {
        this.errorMessage.textContent = message;
        this.clearResult();
    };
    CalculatorUI.prototype.displayResult = function (calculation) {
        if (calculation.status === 'success' && calculation.value !== undefined) {
            this.result.textContent = calculation.value.toString();
            this.result.className = 'result success';
        }
        else if (calculation.error) {
            this.result.textContent = calculation.error;
            this.result.className = 'result error';
        }
    };
    CalculatorUI.prototype.clearError = function () {
        this.errorMessage.textContent = '';
    };
    CalculatorUI.prototype.clearResult = function () {
        this.result.textContent = '';
        this.result.className = 'result';
    };
    return CalculatorUI;
}());
document.addEventListener('DOMContentLoaded', function () {
    new CalculatorUI();
});
