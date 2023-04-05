const generateCatCardPopup = (cat) => {
	return `<div class="popup-wrapper-cat-card active">
        <div class="popup-cat-card active">
        <div class="popup-close-cat-card btn"><i class="fa-solid fa-xmark"></i></div>
        <div class="popup__card">
            <div class="popup__card-info">
                <div>Имя: ${cat.name}</div>
                <div>Описание: ${cat.description}</div>
                <div>Возраст: ${cat.age}</div>
                <div>Рейтинг: ${cat.rate}</div>
                <div>Любимчик: ${cat.favorite ? 'Я Любимчик!' : 'Меня никто не любит=('}</div>
            </div>
            <div class="popup__card-img" style="background: url(${cat.image !== '' ? cat.image : defaultImg}); background-size: cover;">
                
            </div>
        </div>
        </div>
    </div>`;
};