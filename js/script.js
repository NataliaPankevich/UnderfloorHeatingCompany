//слайдер
new Swiper(".hero__slider", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    navigation: {
        prevEl: ".hero__slider-btnprev",
        nextEl: ".hero__slider-btnnext",
    },
    autoplay: {
        delay: 3000,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        560: {
            spaceBetween: 8,
        },
    },
});

//калькулятор

const calcForm = document.querySelector(".js-calc-form");
const calcOrder = document.querySelector(".calc__order");
const totalSquare = document.querySelector(".js-square");
const totalPrice = document.querySelector(".js-total-price");
const calcResultWrapper = document.querySelector(".calc__result-wrapper");
const btnSubmit = document.querySelector(".js-submit");

const tariff = {
    economy: 550,
    comfort: 1400,
    premium: 2200,
};

calcForm.addEventListener("input", () => {
    /*или можно так
      btnSubmit.disabled = !(calcForm.width.value > 0 && calcForm.length.value > 0);
      */
    if (calcForm.width.value > 0 && calcForm.length.value > 0) {
        btnSubmit.disabled = false;
    } else {
        btnSubmit.disabled = true;
    }
});

calcForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(calcForm.width.value);
    console.log(calcForm.length.value);
    console.log(calcForm.tariff.value);

    if (calcForm.width.value > 0 && calcForm.length.value > 0) {
        calcResultWrapper.style.display = "block";
        calcOrder.classList.add('calc__order-show');
        const square = calcForm.length.value * calcForm.width.value;
        const price = square * tariff[calcForm.tariff.value];

        totalSquare.textContent = ` ${square} кв м`;
        totalPrice.textContent = ` ${price} рубли`;
    }
});

//modal

const modalController = ({
    modal,
    btnOpen,
    btnClose,
    time = 300
}) => {
    const buttonElems = document.querySelectorAll(btnOpen);
    const modalElem = document.querySelector(modal);

    modalElem.style.cssText = `
      display: flex;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${time}ms ease-in-out;
    `;

    const closeModal = (event) => {
        const target = event.target;

        if (
            target === modalElem ||
            (btnClose && target.closest(btnClose)) ||
            event.code === "Escape"
        ) {
            modalElem.style.opacity = 0;

            setTimeout(() => {
                modalElem.style.visibility = "hidden";
            }, time);

            window.removeEventListener("keydown", closeModal);
        }
    };

    const openModal = () => {
        modalElem.style.visibility = "visible";
        modalElem.style.opacity = 1;
        window.addEventListener("keydown", closeModal);
    };

    buttonElems.forEach((btn) => {
        btn.addEventListener("click", openModal);
    });

    modalElem.addEventListener("click", closeModal);
};

modalController({
    modal: '.modal',
    btnOpen: '.js-order',
    btnClose: '.modal__close',

});

//mask

const phone = document.getElementById("phone");

var imPhone = new Inputmask("+7(999)999-99-99");
imPhone.mask(phone);

//validation
const validator = new JustValidate('.modal__form', {
    errorLabelCssClass: 'modal__input-error',
    errorLabelStyle: {
        color: '#FFC700',
    },
});

validator
    .addField('#name', [{
            rule: 'required',
            errorMessage: 'Как вас зовут?',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Не короче 3 символов',
        },
        {
            rule: 'maxLength',
            value: 30,
            errorMessage: 'Слищком длинное имя',
        },
    ])
    .addField('#phone', [{
            rule: 'required',
            errorMessage: 'Укажите ваш телефон',
        },
        {
            validator: (value) => {
                const number = phone.inputmask.unmaskedvalue();
                return number.length == 10;
            },
            errorMessage: 'Телефон не корректный',
        }
    ]);

validator.onSuccess((event) => {
    const form = event.currentTarget;
    fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                name:form.name.value,
                phone:form.phone.value,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            form.reset();
            alert(`Спасибо, ваша заявка принята под номером ${data.id}.`)
        });
});