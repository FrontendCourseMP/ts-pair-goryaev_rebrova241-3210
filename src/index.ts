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
        
        return { status: 'valid', message: '' };
    }
    
    getExpression(): string {
        return this.originalExpression;
    }
    
    getCleanedExpression(): string {
        return this.cleanExpression();
    }
}