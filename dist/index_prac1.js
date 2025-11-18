"use strict";
var FioProcessor = /** @class */ (function () {
    function FioProcessor() {
    }
    FioProcessor.isValid = function (part) {
        if (part === '')
            return true;
        if (/[^А-ЯЁа-яё-]/.test(part))
            return false;
        return this.REGEX.test(part);
    };
    FioProcessor.initial = function (part) {
        return part.charAt(0).toUpperCase() + '.';
    };
    FioProcessor.REGEX = /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/;
    return FioProcessor;
}());
var FioUI = /** @class */ (function () {
    function FioUI() {
        var _this = this;
        this.form = document.getElementById('fioForm');
        this.surname = document.getElementById('surname');
        this.name = document.getElementById('name');
        this.patronymic = document.getElementById('patronymic');
        this.surnameErr = document.getElementById('surnameError');
        this.nameErr = document.getElementById('nameError');
        this.patrErr = document.getElementById('patronymicError');
        this.result = document.getElementById('fioResult');
        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.process();
        });
    }
    FioUI.prototype.process = function () {
        this.clearErrors();
        var s = this.surname.value.trim();
        var n = this.name.value.trim();
        var p = this.patronymic.value.trim();
        var ok = true;
        // Базовая проверка (пока без красивых эффектов)
        if (!s) {
            this.error(this.surname, this.surnameErr, 'Фамилия обязательна');
            ok = false;
        }
        else if (!FioProcessor.isValid(s)) {
            this.error(this.surname, this.surnameErr, 'Неправильная фамилия');
            ok = false;
        }
        if (!n) {
            this.error(this.name, this.nameErr, 'Имя обязательно');
            ok = false;
        }
        else if (!FioProcessor.isValid(n)) {
            this.error(this.name, this.nameErr, 'Неправильное имя');
            ok = false;
        }
        if (p && !FioProcessor.isValid(p)) {
            this.error(this.patronymic, this.patrErr, 'Неправильное отчество');
            ok = false;
        }
        if (!ok)
            return;
        this.result.textContent = "".concat(s, " ").concat(FioProcessor.initial(n)).concat(p ? ' ' + FioProcessor.initial(p) : '');
    };
    FioUI.prototype.clearErrors = function () {
        [this.surname, this.name, this.patronymic].forEach(function (i) { return i.classList.remove('error'); });
        [this.surnameErr, this.nameErr, this.patrErr].forEach(function (e) { return e.textContent = ''; });
        this.result.textContent = '';
    };
    FioUI.prototype.error = function (input, el, msg) {
        input.classList.add('error');
        el.textContent = msg;
    };
    return FioUI;
}());
// Запуск
document.addEventListener('DOMContentLoaded', function () { return new FioUI(); });
