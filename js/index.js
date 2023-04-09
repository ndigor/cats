//Блок глобальных переменных проекта
const homepage = document.getElementById('homepage'); //находим элемент с id "homepage"
//const content = document.getElementsByClassName('content')[0];// находим элемент с классом content
//второй вариант найти этот элемент
const content = document.querySelector('.content');
const headerBtns = document.querySelector('.header-btns'); //Находим кнопки добавить и обновить через родительский блок
let store = window.localStorage; // инициализация локального хранилища
let defaultLink =
  'https://f.vividscreen.info/soft/394ef96a4024b9182ac63e52cacd25a5/Cat-Wearing-Funny-Hat-2048x2048.jpg'; // картинка-заглушка

//Блок функций и обработчиков
const refreshCatsAndContent = () => {
  //функция отрисовки карточек
  content.innerHTML = '';
  api.getAllCats().then((res) => {
    console.log(res); // вывод в консоль ответа сервера
    store.setItem('cats', JSON.stringify(res)); // пополнение локального хранилища нашими котами
    const cards = JSON.parse(store.getItem('cats')).reduce(
      (acc, el) => (acc + generateCard(el)),
      ''
    ); //генерация карточек в соответствии с ответом сервера и хранилищем
    content.insertAdjacentHTML('afterbegin', cards); //добавляем карточки в блок content
  });
};

refreshCatsAndContent(); //вызов функции отрисовки карточек

headerBtns.addEventListener(
  'click',
  (event) => {
    //обработчик кнопок добавить и обновить

    if (event.target.tagName === 'BUTTON') {
      switch (event.target.className) {
        case 'add-btn':
          const evt = event.target.value;
          const createCardForm = createCard(); //при нажатии кнопки происходит отрисовка карточки
          content.insertAdjacentHTML('afterbegin', createCardForm); //добавляем карточку на страницу
          const modal = document.querySelector('.create-edit-modal-form'); //находим элемент с классом create-edit-modal-form
          //console.log(modal); // проверка что нашли
          modal.classList.add('active'); //делаем модалку активной
          const modalForm = document.querySelector('form'); //находим форму
          const modalBtnOk = modalForm.querySelector('.button-form-submit'); //находим кнопку отправки формы
          const modalBtnClose = modalForm.querySelector('.button-form-close'); //находим кнопку отправки формы
          modalBtnOk.addEventListener(
            'click',
            (evt) => {
              const forms = document.forms[0];
              event.preventDefault();
              const formData = new FormData(forms); //получаем данные формы
              const catObj = Object.fromEntries(formData); //вытаскиваем объект с данными для отправки
              const cat = { id: getNewIdOfCat(), ...catObj };
              console.log(cat); //выводим новый элемент в консоль
              const favorite = cat.favorite //проверка значения свойства "favorite" и конвертация значения в булев тип
                ? (cat.favorite = true)
                : (cat.favorite = false);
              api
                .addCat({
                  ...catObj,
                  favorite: favorite,
                  id: getNewIdOfCat(),
                })
                .then((res) => {
                  //отправляем нового кота на сервер
                  console.log(res);
                  refreshCatsAndContent(); //отрисовка карточек заново
                });
              modal.classList.toggle('active'); //делаем модалку неактивной
              forms.reset(); //очистка полей формы
              modal.remove(); //удаляем форму из дом-дерева
            },
            { once: true }
          );
          modalBtnClose.addEventListener(
            'click',
            (evt) => {
              modal.remove(); //удаляем форму из дом-дерева
            },
            { once: true }
          );
          break;
        case 'update-btn':
          refreshCatsAndContent();
          break;
      }
    }
  },
  { once: true }
);

content.addEventListener(
  'click',
  (event) => {
    if (event.target.tagName === 'BUTTON') {
      switch (event.target.className) {
        case 'cat-card-view': // обработка нажатия кнопки просмотра
          console.log(event.target.value);
          let catView = getViewCardInLocal(event.target.value);
          console.log(catView);
          const cardViewPopup = generateCardView(catView);
          content.insertAdjacentHTML('afterbegin', cardViewPopup);
          const modalView = document.querySelector('.cardView-popup');

          const modalViewBtn = modalView.querySelector('button');
          modalViewBtn.addEventListener(
            'click',
            (evt) => {
              modalView.remove();
            },
            { once: true }
          );
          break;
        case 'cat-card-update': //обработка редактирования
          const createCardForm = createCard(); //при нажатии кнопки происходит отрисовка карточки
          content.insertAdjacentHTML('afterbegin', createCardForm); //добавляем карточку на страницу
          const modal = document.querySelector('.create-edit-modal-form');
          const popupTitle = document.querySelector('.create-edit-modal-title');
          popupTitle.textContent = 'Редактирование';
          modal.classList.toggle('active'); //делаем модалку активной
          const modalForm = document.querySelector('form'); //находим форму
          const modalBtn = modalForm.querySelector('button'); //находим кнопку отправки формы
          const modalBtnClose = modalForm.querySelector('.button-form-close'); //находим кнопку отправки формы
          const catUpdate = getViewCardInLocal(event.target.value);
          const forms = document.forms[0];
          const formElements = document.forms[0].elements;
          formElements.name.value = catUpdate.name;
          formElements.image.value = catUpdate.image;
          formElements.age.value = catUpdate.age;
          formElements.rate.value = catUpdate.rate;
          if (catUpdate.favorite) {
            formElements.favorite.setAttribute('checked', 'checked');
          }

          formElements.description.value = catUpdate.description;

          modalBtn.addEventListener(
            'click',
            (evt) => {
              forms.addEventListener(
                'submit',
                (event) => {
                  // вешаем обработчик на кнопку формы
                  event.preventDefault();
                  const formData = new FormData(forms); //получаем данные формы
                  const catObj = Object.fromEntries(formData); //вытаскиваем объект с данными для отправки
                  const cat = { id: catUpdate.id, ...catObj };
                  console.log(cat);
                  const favorite = cat.favorite //проверка значения свойства "favorite" и конвертация значения в булев тип
                    ? (cat.favorite = true)
                    : (cat.favorite = false);
                  api.updateCat({ ...cat, favorite: favorite }).then((res) => {
                    console.log(res);
                    refreshCatsAndContent();
                  });
                  modal.classList.toggle('active'); //делаем модалку неактивной
                  forms.reset(); //очистка полей формы
                },
                { once: true }
              );
            },
            { once: true }
          );

          modalBtnClose.addEventListener(
            'click',
            (evt) => {
              modal.remove(); //удаляем форму из дом-дерева
            },
            { once: true }
          );
          break;
        case 'cat-card-delete': //обработка нажатия кнопки удаления
          api.getDeleteCat(event.target.value).then((res) => {
            //запрос удаления кота на сервер
            console.log(res);
            refreshCatsAndContent(); //отрисовка карточек заново
          });
          break;
      }
    }
  },
  { once: true }
);

const getViewCardInLocal = (id) => {
  // функция получения данных из хранилища
  let view = JSON.parse(store.getItem('cats')); // считываем хранилище и преобразуем в объект
  let viewCard = view.find((el) => el['id'] == id); //находим нужный нам объект по id
  return viewCard;
};

const getNewIdOfCat = () => {
  //функция генерации id для нового кота
  let res = JSON.parse(store.getItem('cats')); // получение данных о котах с нашего локального хранилища
  if (res.length) {
    return Math.max(...res.map((el) => el.id)) + 1; //здесь максимально значение из имеющихся на этот момент и увеличение его на единицу
  } else {
    return 1;
  }
};