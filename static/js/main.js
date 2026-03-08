window.onload = function(){
    init();
}

var main_url = "http://localhost:5000"
var create_button;
var find_room_button;
var connect_room_button;
var connecting_room_button;
var score_board_button;
var exit_menu_button;
var result_button;


function init(){
    path = window.location.pathname;
    if (path == "/start"){
        create_button = document.getElementById('Create_name');
        create_button.onclick = create_name;
    }
    if (path == "/menu"){
        find_room_button = document.getElementById('Find_room');
        connect_room_button = document.getElementById('Connect_room');
        score_board_button = document.getElementById('Score_board');
        find_room_button.onclick = find_room;
        connect_room_button.onclick = connect_room;
        score_board_button.onclick = score_board;
        menu_who_win();
    }
    if (path == "/waiting_room"){
        exit_menu_button = document.getElementById('Exit_menu');
        exit_menu_button.onclick = function(){
            var id_room = localStorage.getItem('id_room_main_game');
            if (id_room != ""){
                localStorage.setItem('id_room_main_game', "");
                // ТУТ НУЖНО УДАЛИТЬ КОМНАТУ
            }
            window.location.href = '/menu';
        }
    }

    if (path == "/score_board"){
        exit_menu_button = document.getElementById('Exit_menu');
        exit_menu_button.onclick = function(){
            window.location.href = '/menu';
        }
    }
    if (path == "/connect_room"){
        connecting_room_button = document.getElementById("Connecting_room");
        connecting_room_button.onclick = connecting_room;
    }
    if (path == "/game"){
        result_button = document.getElementById("resButton");
        result_button.onclick = result;
    }
}

function create_name(){
    var name = document.getElementById("Name_input");
    localStorage.setItem('name', name.value);

    api_response(main_url, name.value);
    alert("создал имя "+ name.value);
    window.location.href = '/menu';

}
function find_room(){
    name = localStorage.getItem('name');
    alert("Поиск матча");
    var id = waiting_room_connect(main_url, name);
}
function connect_room(){
    alert("Подключение к комнате по id");
    window.location.href = '/connect_room';

}
function score_board(){
    alert("Таблица лидеров");
    window.location.href = '/score_board';

}
function connecting_room(){
    alert("Подключаюсь к комнате с заданным id");
    window.location.href = '/';

}
function result(){
    alert("РЕЗУЛЬТАТЫ");
    window.location.href;

}



// Запросы к API
async function api_response(url, name) {
    try {
        var new_url = url + "/add_user/" + name;
        const response = await fetch(new_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Полученные данные:', data);
        return data; // Возвращаем данные

    } catch (error) {
        console.error('Ошибка:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}

async function waiting_room_connect(url, name) {
    try {
        var new_url = url + "/find_waiting_room/" + name;
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


//

function menu_who_win(){
    var main_url = "http://localhost:5000";
    var name = localStorage.getItem('name');
    var id_room_last_game = localStorage.getItem("id_room_last_game");
    const intervalId = setInterval(() => {
        if (id_room_last_game!=""){
            console.log('Бесконечный цикл, итерация:', Date.now());
            id_room_last_game = localStorage.getItem("id_room_last_game");
            game_win_or_lose(main_url, name, id_room_last_game);
        }
        else{
            id_room_last_game = localStorage.getItem("id_room_last_game");
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