type ValidationStatus = 'valid' | 'invalid';
type CalculationStatus = 'success' | 'error';

type ValidationResult = {
    status: ValidationStatus;
    message: string;
}

type CalculationResult = {
    status: CalculationStatus;
    value?: number;
    error?: string;
}

class MathExpression {
    private originalExpression: string;
    
    constructor(expression: string) {
        this.originalExpression = expression;
    }
    
    private cleanExpression(): string {
        return this.originalExpression.replace(/[^\d+\-*/().\s]/g, '');
    }
    
    validate(): ValidationResult {
        const cleaned = this.cleanExpression();
        
        if (cleaned.trim().length === 0) {
            return { 
                status: 'invalid', 
                message: 'Выражение не может быть пустым' 
            };
        }
        
        let bracketCount = 0;
        for (const char of cleaned) {
            if (char === '(') bracketCount++;
            if (char === ')') bracketCount--;
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
        
        const operatorRegex = /[+\-*/]{2,}/;
        if (operatorRegex.test(cleaned)) {
            return { 
                status: 'invalid', 
                message: 'Некорректное использование операторов (несколько подряд)' 
            };
        }
        
        return { status: 'valid', message: '' };
    }
    
    calculate(): CalculationResult {
        const validation = this.validate();
        if (validation.status === 'invalid') {
            return { 
                status: 'error', 
                error: validation.message
            };
        }
        
        const cleanedExpression = this.cleanExpression();
        
        try {
            const result = new Function(`return ${cleanedExpression}`)();
            
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
        } catch (error) {
            return { 
                status: 'error', 
                error: 'Ошибка при вычислении выражения'
            };
        }
    }
}

class CalculatorUI {
    private form: HTMLFormElement;
    private expressionInput: HTMLInputElement;
    private errorMessage: HTMLDivElement;
    private result: HTMLDivElement;
    private clearBtn: HTMLButtonElement;
    
    constructor() {
        this.form = document.getElementById('calculatorForm') as HTMLFormElement;
        this.expressionInput = document.getElementById('expression') as HTMLInputElement;
        this.errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
        this.result = document.getElementById('result') as HTMLDivElement;
        this.clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
        
        this.initializeEvents();
    }
    
    private initializeEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.clearBtn.addEventListener('click', this.handleClear.bind(this));
        this.expressionInput.addEventListener('input', this.handleInput.bind(this));
    }
    
    private handleSubmit(event: Event): void {
        event.preventDefault();
        
        const inputValue = this.expressionInput.value.trim();
        const mathExpression = new MathExpression(inputValue);
        
        const validation = mathExpression.validate();
        if (validation.status === 'invalid') {
            this.displayError(validation.message);
            return;
        }
        
        this.clearError();
        
        const calculation = mathExpression.calculate();
        this.displayResult(calculation);
    }
    
    private handleClear(): void {
        this.expressionInput.value = '';
        this.clearError();
        this.clearResult();
        this.expressionInput.focus();
    }
    
    private handleInput(): void {
        this.clearError();
    }
    
    private displayError(message: string): void {
        this.errorMessage.textContent = message;
        this.clearResult();
    }
    
    private displayResult(calculation: CalculationResult): void {
        if (calculation.status === 'success' && calculation.value !== undefined) {
            this.result.textContent = calculation.value.toString();
            this.result.className = 'result success';
        } else if (calculation.error) {
            this.result.textContent = calculation.error;
            this.result.className = 'result error';
        }
    }
    
    private clearError(): void {
        this.errorMessage.textContent = '';
    }
    
    private clearResult(): void {
        this.result.textContent = '';
        this.result.className = 'result';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalculatorUI();
});