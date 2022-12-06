ymaps.ready(init);

// Массив объектов
var placemarks = [];
if(localStorage.getItem('PlacemarkArray') !== null) {
  placemarks = JSON.parse(localStorage.getItem('PlacemarkArray'));
}

// Создание карты и геометок
var geoObjects = [];
var coords;

function init() {
  var map = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 11,
  },
    {
      searchControlProvider: 'yandex#search'
    }),

    BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      `<ul style = "overflow:scroll" class = "reviews">
      <li><b>{{properties.name}}:</b> {{properties.place}}<br>{{properties.comment}}</li>
      </ul>
      <div class="form">
      <form class="form" id="form">
      <h1 class="form__title">Отзыв:</h1>
      <input type="text" class="form__input" name="name" placeholder="Укажите ваше имя">
      <input type="text" class="form__input" name="place" placeholder="Укажите место">
      <textarea class="form__input form__input--textarea" name="comment" placeholder="Оставить отзыв"></textarea>
      <button type="submit" class="form__button" id="form__button">Добавить</button>
      </form>
      </div>`
      );
  var clustererBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
    `<ul class = "reviews">
    {% for geoObject in properties.geoObjects %}<li><b>{{geoObject.properties.name}}</b>: {{geoObject.properties.place}}<br> {{geoObject.properties.comment}}</li>{% endfor %}
    </ul>
    <div class="form">
    <form class="form" id="form">
    <h1 class="form__title">Отзыв:</h1>
    <input type="text" class="form__input" name="name" placeholder="Укажите ваше имя">
    <input type="text" class="form__input" name="place" placeholder="Укажите место">
    <textarea class="form__input form__input--textarea" name="comment" placeholder="Оставить отзыв"></textarea>
    <button type="submit" class="form__button" id="form__button">Добавить</button>
    </form>
    </div>`
    );
  var mapBalloonClick = function (e) {
    e.preventDefault();
    console.log("mapBalloonClick");
    const form = document.querySelector('#form');
    var props = {
      name: form.elements.name.value,
      place: form.elements.place.value,
      comment: form.elements.comment.value
    };
    var data = [];
    var placemark;
    // создаем новую плейсмарку
    data.push(props);
    placemark = new ymaps.Placemark(coords, {
      name: props.name,
      place: props.place,
      comment: props.comment
    },//создаем плейсмарку
      {
        balloonContentLayout: BalloonContentLayout,
        balloonPanelMaxMapArea: 0
      });
    //добавляем плейсмарку
    clusterer.add(placemark);

    let placemarkArray = [];

    if (localStorage.getItem('PlacemarkArray') !== null) {
      placemarkArray = JSON.parse(localStorage.getItem('PlacemarkArray'));
    }

    placemarkArray.push({
      coords: JSON.stringify(coords),
      name: props.name,
      place: props.place,
      comment: props.comment
    });

    localStorage.setItem('PlacemarkArray', JSON.stringify(placemarkArray));

    map.balloon.close();//закрываем балун
  };

  //Открытие балуна при щелчке левой кнопкой мыши на карте
  map.events.add('click', function (e) {
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
  });

  //Открытие хинта с подсказкой при щелчке правой кнопкой мыши
  map.events.add('contextmenu', function (e) {
    map.hint.open(e.get('coords'), 'Нажмите левой кнопкой мыши для добавления отзыва:)');
  });

  //Обрабатываем октрытие балуна при клике на карту
  map.events.add('balloonopen', function (e) {
    map.hint.close();//закрываем подсказку
    if(e.get('target').geometry != undefined) {
      coords = e.get('target').geometry.getCoordinates();
    }
    console.log("balloonopen");
    document.querySelector('#form__button').onclick = mapBalloonClick;//добавляем обраточик на кнопку "Добавить"
  });

  // Кластеризация
  var clusterer = new ymaps.Clusterer(
    {
      clusterBalloonContentLayout: clustererBalloonContentLayout,
      clusterDisableClickZoom: true,
      gridSize: 512,
    }
  );
  for(let i = 0; i < placemarks.length; i++) {
    let info = placemarks[i];
    clusterer.add(new ymaps.Placemark(JSON.parse(info.coords), {
      name: info.name,
      place: info.place,
      comment: info.comment
    },//создаем плейсмарку
      {
        balloonContentLayout: BalloonContentLayout,
        balloonPanelMaxMapArea: 0
      }));
  }
  // Добавление объектов на карту
  map.geoObjects.add(clusterer);
}
