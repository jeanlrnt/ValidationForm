const inputsValidity = {
    user: false,
    email: false,
    password: false,
    passwordConfirmation: false
}

const form = document.querySelector('form');
const container = document.querySelector('.container');

form.addEventListener('submit', handleForm);

let isAnimating = false;
function handleForm(event) {
    event.preventDefault();
    const keys = Object.keys(inputsValidity);
    const failedInputs = keys.filter(key => !inputsValidity[key]);

    if (failedInputs.length && !isAnimating) {
        isAnimating = true;
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
            isAnimating = false;
        }, 400);

        failedInputs.forEach(key => {
            const index = keys.indexOf(key);
            showValidation({index, validation: false});
        });
    } else {
        alert('Données envoyées avec succès !');
    }
}

const validationIcons = document.querySelectorAll('.icon-verif');
const validationTexts = document.querySelectorAll('.error-msg');

function showValidation({index, validation}) {
    if (validation) {
        validationIcons[index].style.display = 'inline';
        validationIcons[index].src = 'ressources/check.svg';
        if (validationTexts[index])
            validationTexts[index].style.display = 'none';
    } else {
        validationIcons[index].style.display = 'inline';
        validationIcons[index].src = 'ressources/error.svg';
        if (validationTexts[index])
            validationTexts[index].style.display = 'block';
    }
}

const userInput = document.querySelector('.input-group:nth-child(1) input');

userInput.addEventListener('blur', userValidation);
userInput.addEventListener('input', userValidation);

function userValidation() {
    showValidation({index: 0, validation: userInput.value.length >= 3});
    inputsValidity.user = userInput.value.length >= 3;
}

const emailInput = document.querySelector('.input-group:nth-child(2) input');

emailInput.addEventListener('blur', emailValidation);
emailInput.addEventListener('input', emailValidation);

const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
function emailValidation() {
    showValidation({index: 1, validation: regexEmail.test(emailInput.value)});
    inputsValidity.email = regexEmail.test(emailInput.value);
}

const passwordInput = document.querySelector('.input-group:nth-child(3) input');

passwordInput.addEventListener('blur', passwordValidation);
passwordInput.addEventListener('input', passwordValidation);

const passwordVerification = {
    length: false,
    symbol: false,
    number: false
}

const regexList = {
    length: /.{6,}/,
    symbol: /[^a-zA-Z0-9\s]/,
    number: /\d/
}

let passwordValue;

function passwordValidation() {
    passwordValue = passwordInput.value;

    let validationResult = 0;
    for (const key in passwordVerification) {    
        if (passwordVerification[key] = regexList[key].test(passwordValue)) {
            validationResult++;
        }
    }

    showValidation({index: 2, validation: validationResult === 3});
    inputsValidity.password = validationResult === 3;

    passwordStrength();
}

const lines = document.querySelectorAll('.lines div');

function passwordStrength() {
    const passwordLength = passwordInput.value.length;

    if (!passwordLength) {
        addLines(0);
    } else if (passwordLength > 9 && passwordVerification.symbol && passwordVerification.number) {
        addLines(3);
    } else if (passwordLength > 6 && passwordVerification.symbol || passwordVerification.number) {
        addLines(2);
    } else {
        addLines(1);
    }

    function addLines(numberOfLines) {
        lines.forEach((line, index) => {
            if (index < numberOfLines) {
                line.style.display = 'block';
            } else {
                line.style.display = 'none';
            }
        });
    }

    if (validationIcons[3].style.display === 'inline') {
        passwordConfirmationValidation();
    }
}

const passwordConfirmationInput = document.querySelector('.input-group:nth-child(4) input');

passwordConfirmationInput.addEventListener('blur', passwordConfirmationValidation);
passwordConfirmationInput.addEventListener('input', passwordConfirmationValidation);

function passwordConfirmationValidation() {
    const confirmedValue = passwordConfirmationInput.value;

    if (!confirmedValue && !passwordValue) {
        validationIcons[3].style.display = 'none';
    } else {
        showValidation({index: 3, validation: confirmedValue === passwordValue});
        inputsValidity.passwordConfirmation = confirmedValue === passwordValue;
    }
}
