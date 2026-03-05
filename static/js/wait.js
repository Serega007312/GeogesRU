window.onload = function(){
    init();
}


function init(){
    var main_url = "http://localhost:5000";
    var name = localStorage.getItem('name');

    const intervalId = setInterval(() => {
    console.log('Бесконечный цикл, итерация:', Date.now());
    go_game(main_url, name);
    }, 5000);
}

async function go_game(url, name) {
    try {
        var new_url = url + "/go_game/" + name;
        const response = await fetch(new_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data["redirect"] == "/start"){
            window.location.href = '/start';
            }
        if (data["redirect"] == "/waiting_room"){
            localStorage.setItem('id_room_main_game', data["id_room"]);
            window.location.href = '/waiting_room';
            }
        if (data["redirect"] == "/game"){
            localStorage.setItem('id_room_main_game', data["id_room"]);
            window.location.href = '/game/'+data["id_room"];
            }
        return data; // Возвращаем данные

    } catch (error) {
        console.error('Ошибка:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}
