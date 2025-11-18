class FioProcessor {
    private static readonly REGEX = /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/;

    static isValid(part: string): boolean {
        if (part === '') return true;
        if (/[^А-ЯЁа-яё-]/.test(part)) return false;
        return this.REGEX.test(part);
    }

    static initial(part: string): string {
        return part.charAt(0).toUpperCase() + '.';
    }
}

class FioUI {
    private form = document.getElementById('fioForm') as HTMLFormElement;
    private surname = document.getElementById('surname') as HTMLInputElement;
    private name = document.getElementById('name') as HTMLInputElement;
    private patronymic = document.getElementById('patronymic') as HTMLInputElement;
    private surnameErr = document.getElementById('surnameError') as HTMLElement;
    private nameErr = document.getElementById('nameError') as HTMLElement;
    private patrErr = document.getElementById('patronymicError') as HTMLElement;
    private result = document.getElementById('fioResult') as HTMLElement;

    constructor() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.process();
        });
    }

    private process() {
        this.clearErrors();

        const s = this.surname.value.trim();
        const n = this.name.value.trim();
        const p = this.patronymic.value.trim();

        let ok = true;

        // Базовая проверка (пока без красивых эффектов)
        if (!s) { this.error(this.surname, this.surnameErr, 'Фамилия обязательна'); ok = false; }
        else if (!FioProcessor.isValid(s)) { this.error(this.surname, this.surnameErr, 'Неправильная фамилия'); ok = false; }

        if (!n) { this.error(this.name, this.nameErr, 'Имя обязательно'); ok = false; }
        else if (!FioProcessor.isValid(n)) { this.error(this.name, this.nameErr, 'Неправильное имя'); ok = false; }

        if (p && !FioProcessor.isValid(p)) { this.error(this.patronymic, this.patrErr, 'Неправильное отчество'); ok = false; }

        if (!ok) return;

        this.result.textContent = `${s} ${FioProcessor.initial(n)}${p ? ' ' + FioProcessor.initial(p) : ''}`;
    }

    private clearErrors() {
        [this.surname, this.name, this.patronymic].forEach(i => i.classList.remove('error'));
        [this.surnameErr, this.nameErr, this.patrErr].forEach(e => e.textContent = '');
        this.result.textContent = '';
    }

    private error(input: HTMLInputElement, el: HTMLElement, msg: string) {
        input.classList.add('error');
        el.textContent = msg;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => new FioUI());