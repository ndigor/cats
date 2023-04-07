const generateCard = (cat) => {
	return `
        <div class="cat-card">
        <i class="fa-heart card__like ${cat.favorite ? 'fa-solid' : 'fa-regular'}" data-id='${cat.id}'></i>
            <div class="cat-card-image" >
                <img src=${cat.image !== '' ? cat.image : defaultImg} /> 
            </div>
            <div class="card_title">Меня зовут: ${cat.name}</div>
            <div class="card_age">Возраст: ${cat.age} </div>
            <div class="cat-card-btns">
                <button class="cat-card-view" value=${cat.id}>Посмотреть</button>
                <button class="cat-card-update" value=${cat.id}>Изменить</button> 
                <button class="cat-card-delete" value=${cat.id}>Удалить</button>
            </div>
        </div>
    `;
};

/* <img src=${cat.image !== '' ? cat.image : '/img/header_cats.jpg'} />  */
