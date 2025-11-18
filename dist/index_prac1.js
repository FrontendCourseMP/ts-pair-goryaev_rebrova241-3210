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
        // Очистка ошибки при вводе
        [this.surname, this.name, this.patronymic].forEach(function (input) {
            return input.addEventListener('input', function () {
                input.classList.remove('error');
                var errEl = document.getElementById(input.id + 'Error');
                errEl.textContent = '';
            });
        });
    }
    FioUI.prototype.process = function () {
        var _this = this;
        this.clearErrors();
        var s = this.surname.value.trim();
        var n = this.name.value.trim();
        var p = this.patronymic.value.trim();
        var ok = true;
        if (!s) {
            this.error(this.surname, this.surnameErr, 'Фамилия обязательна');
            ok = false;
        }
        else if (!FioProcessor.isValid(s)) {
            this.error(this.surname, this.surnameErr, 'Только русские буквы, первая — заглавная');
            ok = false;
        }
        if (!n) {
            this.error(this.name, this.nameErr, 'Имя обязательно');
            ok = false;
        }
        else if (!FioProcessor.isValid(n)) {
            this.error(this.name, this.nameErr, 'Только русские буквы, первая — заглавная');
            ok = false;
        }
        if (p && !FioProcessor.isValid(p)) {
            this.error(this.patronymic, this.patrErr, 'Только русские буквы, первая — заглавная');
            ok = false;
        }
        if (!ok)
            return;
        this.result.textContent = "".concat(s, " ").concat(FioProcessor.initial(n)).concat(p ? ' ' + FioProcessor.initial(p) : '', ".");
        this.result.style.opacity = '0';
        this.result.style.transform = 'translateY(10px)';
        setTimeout(function () {
            _this.result.style.transition = 'all 0.4s ease';
            _this.result.style.opacity = '1';
            _this.result.style.transform = 'translateY(0)';
        }, 50);
    };
    FioUI.prototype.clearErrors = function () {
        [this.surname, this.name, this.patronymic].forEach(function (i) { return i.classList.remove('error'); });
        [this.surnameErr, this.nameErr, this.patrErr].forEach(function (e) { return e.textContent = ''; });
    };
    FioUI.prototype.error = function (input, el, msg) {
        input.classList.add('error');
        el.textContent = msg;
    };
    return FioUI;
}());
document.addEventListener('DOMContentLoaded', function () { return new FioUI(); });
