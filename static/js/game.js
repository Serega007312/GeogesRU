ymaps.ready(init);

var myMap;
var myTargetPoint;
var coordinatesCLICK;
var myPlacemark;
var main_url = "http://localhost:5000";

function init(){
     // Создание карты.
     myMap = new ymaps.Map("map2", {
         center: [55.733842, 37.588144],
         zoom: 9
     });


     // Привязываемся к кнопкам
     // СТАРТ
     const buttonStart = document.getElementById('startButton');
     // Добавляем обработчик события 'click'
     buttonStart.addEventListener('click', startButtonEvent);


     // Проверка результата
     const buttonRes = document.getElementById('resButton');
     // Добавляем обработчик события 'click'
     buttonRes.addEventListener('click', resButtonEvent);
}



// Функция для предупреждения
function Attention(event)
{
    alert("Вы открыли подсказку, за это придётся вас отстрапонить :D");
}


// Функция определения рандомного значения из заданного периуда
function getRandomFloat(min, max)
{
    return Math.random() * (max - min) + min;
}



function startButtonEvent(event)
{
    // Проверяем может ли быть добавлена Панорама

    if (ymaps.panorama.isSupported()) {
        // Если можем то получаем рандомное значение
        // широты
        // долготы
        var latitude = getRandomFloat(41.11, 81.51);
        var longitude = getRandomFloat(-19.38, 169.05);


        // Создаём панораму
        var locateRequest = ymaps.panorama.locate([53.173713, 44.960436], {radius: 100000});

        locateRequest.then(
        function (panoramas) {
            if (panoramas.length) {
                // Создаём плеер для отображения Панорамы
                var player = new ymaps.panorama.Player('panorama2', panoramas[0], {});

                //player.events.add("markermouseenter", SUKA); Событие наведения на подсказку
                player.events.add("markerexpand", Attention); // Событие при нажатие на маркер подсказки
                player.events.add("panoramachange", Attention) // Событие при перемещении с точки стояния
                alert(player.getPosition());

            } else {
                startButtonEvent(event);
                console.log("Для заданной точки не найдено ни одной панорамы. Попробуй нажать на кнопку ещё раз" + latitude +" "+ longitude);
            }
        },
        function (err) {
            alert("При попытке получить панораму возникла ошибка." + latitude +" "+ longitude);
        })

    } else {
        console.log("Данный браузер не поддерживается.");
    }


    myTargetPoint = [53.173713, 44.960436];

    // Добавляем на карту детект клика
    myMap.events.add("click", function (e) {
        coordinatesCLICK = e.get('coords');  // Получаем координаты там где кликнули

        // Проверяем есть ли метка на карте
        // Если есть то удаляем
        if (myPlacemark)
        {
            myMap.geoObjects.remove(myPlacemark);
        }

        myPlacemark = new ymaps.Placemark(      // Рисуем флаг в месте щелчка
                coordinatesCLICK,
                {
                    preset: "islands#redDotIcon",
                }
        );

        myMap.geoObjects.add(myPlacemark);         // Добавляем его на карту

    });


}

function resButtonEvent(event)
{
    var distance = ymaps.coordSystem.geo.getDistance(coordinatesCLICK, myTargetPoint);
    var id_room = localStorage.getItem('id_room_main_game');
    var name = localStorage.getItem('name');
    game_my_res(main_url, id_room, name, distance);
    alert(distance);

}



async function game_my_res(url, id_room, name, res) {
    try {
        var new_url = url + "/game_res/" + name+"/"+id_room+"/"+parseFloat(res);
        const response = await fetch(new_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data["redirect"] == "/menu"){
            localStorage.setItem('id_room_main_game', "");
            localStorage.setItem('id_room_last_game', id_room);
            window.location.href = '/menu';
            }

        return data; // Возвращаем данные

    } catch (error) {
        console.error('Ошибка:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}