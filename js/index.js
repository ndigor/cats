let store = window.localStorage; 
const content = document.querySelector('.content');
const modalOverlay = document.querySelector('.overlay');
const modalForm = document.querySelector('form'); 
const modalBtn = modalForm.querySelector('button'); 
const modalCloseBtn = document.querySelector('.close__modal'); 
const btnAddCat = document.querySelector('.add__cat');
const defaultImg = 'https://proprikol.ru/wp-content/uploads/2020/08/krasivye-kartinki-kotikov-58.jpg';
const cardLike = document.querySelector('.card__like');
//---------- Отрисовка и обновление карточек
const refreshCatsAndContent = () => {
    content.innerHTML = '';
    api.getAllCats().then(res => {
		store.setItem('cats', JSON.stringify(res));
		const cards = JSON.parse(store.getItem('cats'));
        // const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
        // content.insertAdjacentHTML('afterbegin', cards);
        res.forEach(element => {
        content.insertAdjacentHTML('afterbegin', generateCard(element));
        });
    });
};

refreshCatsAndContent();

const refreshCardsLocalStorage = () => {
	content.innerHTML = '';
	const cards = JSON.parse(store.getItem('cats'));
	cards.forEach(element => {
        content.insertAdjacentHTML('afterbegin', generateCard(element));
    });
};

//-------------Добавление одного кота------------------
btnAddCat.addEventListener('click', () => {
	document.querySelector('.disabled').readOnly = false;
	modalOverlay.classList.add('active');
		modalForm.addEventListener('submit', (event) => {			
				event.preventDefault();
				// Проверка на картинку есть или нет кота
				const reg = 'http';
				if (!modalForm.image.value.startsWith(reg)) {
					modalForm.image.value = defaultImg;
				} 
				const formData = new FormData(modalForm); 
				const cat = Object.fromEntries(formData); 
				if (cat.favorite) {
					cat.favorite = true;
				} else {
					cat.favorite = false;
				}
				
				api.addCat({...cat, id:getNewIdOfCat()}).then(() => { 
				modalOverlay.classList.remove('active');
				addCatLocalStorage(cat);
				refreshCardsLocalStorage(); 
			})
			modalForm.reset();
		}, { once: true });
})

// ----------------Просмотр одного кота---------------
const openCatCardPopup = (cat) => {
	content.insertAdjacentHTML('afterbegin', generateCatCardPopup(cat));
	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closeCatPopup = document.querySelector('.popup-close-cat-card');
	closeCatPopup.addEventListener('click', () => {
		catPopup.remove();
	});
};
// --------------Обработка кликов на кнопоки карточек-----------------
content.addEventListener('click', (event) => {
	const idCat = event.target.value;
		if (event.target.tagName === 'BUTTON') {
			switch (event.target.className) {
				case 'cat-card-view':
					api.getCatById(idCat).then((res) => {
						openCatCardPopup(res);
					});
				break;
				case 'cat-card-update': 
					modalOverlay.classList.add('active');
					api.getCatById(idCat).then((res) => {
						document.querySelector('.disabled').readOnly = true;
						let form_elem = modalForm.getElementsByTagName("input");
						for (let index = 0; index < form_elem.length; index++) {
							Object.entries(res).forEach(([key, value]) => {
								if (form_elem[index].name == key) {
									form_elem[index].value = value;
									if(value === true) {
										form_elem[index].checked = true;
									}
								}
							})
						}
					});
					modalForm.addEventListener('submit', (event) => {
						event.preventDefault();
						const formData = new FormData(modalForm); 
						const cat = Object.fromEntries(formData); 
						if (cat.favorite) {
							cat.favorite = true;
						} else {
							cat.favorite = false;
						}
						api.updateCat(cat).then((res) => { 							
							deleteCatLocalStorage(idCat);
							addCatLocalStorage(cat);
							refreshCardsLocalStorage();
						}); 
						modalOverlay.classList.remove('active');
						modalForm.reset();
					}, { once: true });
					modalForm.reset();
				break;
				case 'cat-card-delete': 
						api.deleteCat(idCat).then(() => {
							deleteCatLocalStorage(idCat);
							refreshCardsLocalStorage();
						});
				break;
				default: break;
			}
		}
		if (event.target.classList.contains('card__like')) {
			const idCatLike = event.target.dataset.id;
			const obj = {
				id: idCatLike,
				favorite: true,
			};
			if (event.target.classList.contains('fa-regular')) {
				obj.favorite = true;
			} else {
				obj.favorite = false;
			}
			event.target.classList.toggle('fa-regular');
			event.target.classList.toggle('fa-solid');
			api.updateCat(obj)
		}
	});
// -------------------------------
// Закрытие модалки на кпопку
modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
	modalForm.reset();	
	addEventCat = 0;
})
// ------------------------------------------------

const addCatLocalStorage = (cat) => {
	store.setItem('cats', JSON.stringify([...JSON.parse(store.getItem('cats')), cat]));
};

const deleteCatLocalStorage = (catId) => {
	store.setItem('cats',JSON.stringify(JSON.parse(store.getItem('cats')).filter((el) => el.id != catId)));
};

// const getNewIdOfCat = () => {
// 	return api.getIdsOfCat().then((res) => {
// 		if (res.length) {
// 			return Math.max(...res) + 1;
// 		} else {
// 			return 1;
// 		}
// 	});
// };

const getNewIdOfCat = () => {
	let res = JSON.parse(store.getItem('cats')); 
	if (res.length) {
		console.log(Math.max(...res.map((el) => el.id)) + 1);
		return Math.max(...res.map((el) => el.id)) + 1; 
	} else {
		return 1;
	}
};
