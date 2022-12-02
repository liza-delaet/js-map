ymaps.ready(init);

// Массив объектов
var placemarks = [];

// Создание карты и геометок
var geoObjects = [];
var coords;
var map2;
// const formButton = document.querySelector('#form__button');
// console.log(formButton);
// formButton.events.add('click', (e) => {
//   e.preventDefault();
//   console.log('клик');
// })




function init() {
  var map = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 11,
  },
    {
      searchControlProvider: 'yandex#search'
    }),

    BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      '<ul class = "reviews"> ' +
      '<li>{{properties.name}}: {{properties.place}}, {{properties.comment}}</li>' +
      '</ul>' +
      '<div class="form">' +
      '<form class="form" id="form">' +
      '<h1 class="form__title">Отзыв:</h1>' +
      '<input type="text" class="form__input" name="name" placeholder="Укажите ваше имя">' +
      '<input type="text" class="form__input" name="place" placeholder="Укажите место">' +
      '<textarea class="form__input form__input--textarea" name="comment" placeholder="Оставить отзыв"></textarea>' +
      '<button type="submit" class="form__button" id="form__button">Добавить</button>' +
      '</form>' +
      '</div>', {
    });
    var clustererBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      '<ul class = "reviews"> ' +
      '{% for geoObject in properties.geoObjects %}<li>{{geoObject.properties.name}}: {{geoObject.properties.place}}, {{geoObject.properties.comment}}</li>{% endfor %}' +
      '</ul>' +
      '<div class="form">' +
      '<form class="form" id="form">' +
      '<h1 class="form__title">Отзыв:</h1>' +
      '<input type="text" class="form__input" name="name" placeholder="Укажите ваше имя">' +
      '<input type="text" class="form__input" name="place" placeholder="Укажите место">' +
      '<textarea class="form__input form__input--textarea" name="comment" placeholder="Оставить отзыв"></textarea>' +
      '<button type="submit" class="form__button" id="form__button">Добавить</button>' +
      '</form>' +
      '</div>', {
    });
    map2 = map;
    var mapBalloonClick = function(e) {
      e.preventDefault();
      console.log("mapBalloonClick");
      const form = document.querySelector('#form');
      var props = {
        name: form.elements.name.value,
        place: form.elements.place.value,
        comment: form.elements.comment.value
      };
      var data = [];
      let i;
      var placemark;
      // for(i = 0; i < map.geoObjects.getLength(); i++) {
      //   if(map2.geoObjects.get(i) instanceof ymaps.Placemark === true && map.geoObjects.get(i).geometry._coordinates[0] === coords[0] && map.geoObjects.get(i).geometry._coordinates[1] === coords[1]) {
      //     break;
      //   }
      // }
      // if(i != map.geoObjects.getLength()) { // если мы нашли плейсмарку с такими же координатами
      //     placemark = map.geoObjects.get(i);
          
      //     data = placemark.properties.get('data');
      //     data.push(props);
      //     //placemark.properties.set('data', data);
      //     placemark.properties.set('name', props.name);
      //     placemark.properties.set('place', props.place);
      //     placemark.properties.set('comment', props.comment);
      //     data.length;//это наша цифра в кругляше

      // }
      // else { // создаем новую плейсмарку
        data.push(props);
        placemark = new ymaps.Placemark(coords, {
          //data: data,
          name: props.name,
          place: props.place,
          comment: props.comment
        },//создаем плейсмарку
          {
            balloonContentLayout: BalloonContentLayout,
            balloonPanelMaxMapArea: 0
          });
        //map.geoObjects.add(placemark);//добавляем плейсмарку на карту
        clusterer.add(placemark);
      // } //end else
      map.balloon.close();//закрываем балун
    };

  //Открытие балуна при щелчке левой кнопкой мыши на карте
  map.events.add('click', function (e) {
    if (!map.balloon.isOpen()) {
      coords = e.get('coords');
      var balloon = map.balloon.open(coords,
        '<div class="form">' +
        '<form class="form" id="form">' +
        '<h1 class="form__title">Отзыв:</h1>' +
        '<input type="text" class="form__input" name="name" placeholder="Укажите ваше имя">' +
        '<input type="text" class="form__input" name="place" placeholder="Укажите место">' +
        '<textarea class="form__input form__input--textarea" name="comment" placeholder="Оставить отзыв"></textarea>' +
        '<button type="submit" class="form__button" id="form__button">Добавить</button>' +
        '</form>' +
        '</div>'
      );
    }
    else {
      map.balloon.close();
    }
  });

  //Открытие хинта с подсказкой при щелчке правой кнопкой мыши
  map.events.add('contextmenu', function (e) {
    map.hint.open(e.get('coords'), 'Нажмите левой кнопкой мыши для добавления отзыва:)');
  });

  //Обрабатываем октрытие балуна при клике на карту
  map.events.add('balloonopen', function (e) {
    map.hint.close();//закрываем подсказку
    console.log("balloonopen");
    document.querySelector('#form__button').onclick = mapBalloonClick;//добавляем обраточик на кнопку "Добавить"
  });

  // Кластеризация
  var clusterer = new ymaps.Clusterer(
    {
      clusterBalloonContentLayout: clustererBalloonContentLayout,
      clusterDisableClickZoom: true,
      //gridSize: 10000,
      groupByCoordinates: true,
    }
  );

  // Добавление объектов на карту
  map.geoObjects.add(clusterer);
  //map.geoObjects.add(placemarkBaloon);
  // clusterer.add(geoObjects);
}


//Получить доступ к инпутам

//Сохранять данные из инпутов в массив объектов?

//При нажатии на плейсмарк должна открываться форма для составления нового отзыва об этих кординатах
//И выводиться все ранее оставленные отзывы списком в хедере балуна

//Кластеризация - отзывы поблизости группируются в одну метку
//У сгруппированных меток выводится их количество
//при масштабировании карты, происходит группировка меток

//Локал сторадж - при перезагрузке страницы, все отзывы и плейсмарки должны быть восстановлены
