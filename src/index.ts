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