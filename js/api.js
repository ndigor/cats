// 1 GET https://cats.petiteweb.dev/api/single/:user/show - отобразить всех котиков
// 1 GET https://cats.petiteweb.dev/api/single/:user/ids - отобразить все возможные айди котиков
// 1 GET https://cats.petiteweb.dev/api/single/:user/show/:id  - отобразить конкретного котика
// 1 POST https://cats.petiteweb.dev/api/single/:user/add - добавить котика
// 1 PUT https://cats.petiteweb.dev/api/single/:user/update/:id - изменить информацию о котике
// 0 DELETE  https://cats.petiteweb.dev/api/single/:user/delete/:id - удалить котика из базы данных

const config = {
	baseUrl: 'https://cats.petiteweb.dev/api/single/IgorN/',
};

class Api {
	constructor(config) {
		this.baseUrl = config.baseUrl;
	}

	getAllCats = () => {
		return fetch(`${this.baseUrl}show`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	addCat = (cat) => {
		return fetch(`${this.baseUrl}add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cat),
		}).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	updateCat = (newCat) => {
		return fetch(`${this.baseUrl}update/${newCat.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newCat),
		}).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

    getAllCatsId = (cat) => {
		return fetch(`${this.baseUrl}ids`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};
    

    getCatById = (id) => {
        return fetch(`${this.baseUrl}show/${id}`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
    }

    getDeleteCat = (id) => {
        return fetch(`${this.baseUrl}delete/${id}`, {
            method: 'DELETE'
        }).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
    }
}

let api = new Api({
	baseUrl: 'https://cats.petiteweb.dev/api/single/IgorN/',
});

// api
// 	.addCat({
// 		id: 4,
// 		name: 'Басик',
// 		favorite: false,
// 		rate: 10,
// 		age: 2,
// 		description: 'Милый плюшевый котенок',
// 		image:
// 			'https://sun9-71.userapi.com/impf/pwHVP1A43H4ihq4wq9yeIWtHlH0Jz5wpld6iAQ/6SrWicnNqPc.jpg?size=1280x800&quality=96&sign=47e084ab0427aaa8fd1e8411cdbfdb16&c_uniq_tag=ae03XB56vr4P2o7q7EaGB50pOua2zvdDpnNTC9sFcwo&type=album',
// 	})
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// 	getAllCatsId = (cat) => {
// 		return fetch(`${this.baseUrl}ids`).then((res) => {
// 			return res.ok ? res.json() : Promise.reject('У меня лапки');
// 		}).then((res) => console.log(res));
// 	};
