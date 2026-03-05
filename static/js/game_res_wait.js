// ТУТ ОПИСЫВАЕМ ОЖИДАНИЕ ОТВЕТА РЕЗУЛЬТАТА ОТ СЕРВЕРА
// КТО ПОБЕДИЛ КОРОЧЕ


window.onload = function(){
    //init();
}


function init(){
    var main_url = "http://localhost:5000";
    var name = localStorage.getItem('name');
    var id_room_last_game = localStorage.getItem("id_room_last_game");
    const intervalId = setInterval(() => {
        if (id_room_last_game!=""){
            console.log('Бесконечный цикл, итерация:', Date.now());
            game_win_or_lose(main_url, name, id_room_last_game);
            var id_room_last_game = localStorage.getItem("id_room_last_game");
        }
        else{
            var id_room_last_game = localStorage.getItem("id_room_last_game");
        }
    }, 5000);

}

// ТУТ НАДО ЗАПРОСИТЬ КТО ПОБЕДИЛ
// Если есть победитель то удалять ид из ласт гаме
async function game_win_or_lose(url, name, id_room) {
    try {
        var new_url = url + "/who_win/" + name+"/"+id_room;
        const response = await fetch(new_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data["status"] == "None"){
            localStorage.setItem("id_room_last_game", "");
            }
        if (data["status"] == "Ты выйграл"){
            alert("Вы выйграли в игре: " + id_room);
            localStorage.setItem('id_room_last_game', "");
            }
        if (data["status"] == "Ты проиграл"){
            alert("К сожалению ты проиграл в игре: " + id_room);
            localStorage.setItem('id_room_last_game', "");
            }
        return data; // Возвращаем данные

    } catch (error) {
        console.error('Ошибка:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}