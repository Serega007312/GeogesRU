//initMap();
//
//async function initMap() {
//    await ymaps3.ready;
//
//    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener,YmapPanorama} = ymaps3;
//
//    const myCoordinates =  {latitude: 55.733842, longitude: 37.588144};
//
//    const map = new YMap(
//        document.getElementById('map1'),
//        {
//            location: {
//                // Координаты центра карты
//                center: [37.588144, 55.733842],
//                // Уровень масштабирования
//                zoom: 10
//            }
//        }
//    );
//
//    map.addChild(new YMapDefaultSchemeLayer());
//    map.addChild(new YMapDefaultFeaturesLayer());
//
//
//    const markerConteiner = document.createElement('div');
//
//
//    const markerImage = document.createElement('img');
//    markerImage.classList.add('image');
//    markerConteiner.innerText = "ИСКОМОЕ МЕСТО";
//
//    markerConteiner.appendChild(markerImage);
//
//
//    const marker = new YMapMarker(
//    {
//        coordinates: [37.588144, 55.733842],
//    },
//      markerConteiner
//    );
//
//    map.addChild(marker);
//
//
//    // -------------Реакция на клики--------------------------------------- //
//
//    function calculateDistance(point1, point2) {
//                const R = 6371000; // Радиус Земли в метрах
//                const lat1 = point1.latitude * Math.PI / 180;
//                const lat2 = point2.latitude * Math.PI / 180;
//                const deltaLat = (point2.latitude - point1.latitude) * Math.PI / 180;
//                const deltaLon = (point2.longitude - point1.longitude) * Math.PI / 180;
//
//                const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//                          Math.cos(lat1) * Math.cos(lat2) *
//                          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
//
//                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//
//                return R * c; // Расстояние в метрах
//            }
//
//    const clickHandler = (object, event) => {
//        const clickCoordinates = event.coordinates;
//        const meters = calculateDistance(myCoordinates, {latitude: clickCoordinates[1], longitude: clickCoordinates[0]});
//        alert(meters);
//    };
//
//
//    // Создание объекта-слушателя.
//    const mapListener = new YMapListener({
//      layer: 'any',
//      // Добавление обработчиков на слушатель.
//      onClick: clickHandler,
//    });
//
//    // Добавление слушателя на карту.
//    map.addChild(mapListener);
//
//    //-------------------------------------------------------------------------------------------//
//
//    //-------------------------Панорама V.3------------------------------------------------------------//
//    // Тех поддержка пока сказала нету
//    //              =(
//    //---------------------------------------------------------------------------------------------//
//
//};
//      html добавь <div id="map1" style="width: 600px; height: 400px"></div>
// СТАРОЕ АПИ V.2


ymaps.ready(init);

var myMap;
var myTargetPoint;
var coordinatesCLICK;
var myPlacemark;


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
    alert(distance);

}



