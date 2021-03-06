#!/bin/bash
#cloudy
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"На улице хмуро, поэтому просто улыбайся!", "author": "skotlov", "authorType": "twitter"}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"На улице ничего не будет. Дождя не будет, солнца не будет. Но обязательно должно быть хорошее настроение."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"Не загоришь конечно, но и не промокнешь."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"Пасмурно, но дождя не ожидается. Хотя… лучше взять зонт, ты же в Петербурге."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"Облакааа... белокрылые лошаадки!!!", "author": "lltwox", "authorType": "twitter"}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "cloudy", "season": "summer", "suggestion":"Можно погулять под серым небом, но лучше останься дома. Попей чаю. Испеки печенюшки."}'

#occasional_rain
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "occasional_rain", "season": "summer",  "suggestion":"У природы нет плохой погоды. И вообще, Петербург - ее любимец."}'

#variable
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "variable", "season": "summer", "suggestion":"Не загоришь конечно, но и не промокнешь."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "variable", "season": "summer", "suggestion":"Облакааа... белокрылые лошаадки!!!", "author": "lltwox", "authorType": "twitter"}'

#rainy
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"У природы нет плохой погоды. И вообще, Петербург - ее любимец.", "author": "lltwox", "authorType": "twitter"}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"Как раз один из тех <a href=\"http://hit-rim.livejournal.com/85669.html\">226 дней</a> в Петербурге, когда вы можете сказать, что дождь - это прекрасно."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"Петербург не зря стал культурной столицей. Действительно, чем же еще в такую погоду заниматься."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"Ну теперь-то ты понимаешь, почему у нас дома не моют после зимы?", "author": "skotlov", "authorType": "twitter"}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"Не ходи никуда. Возьми любимую книжку, посмотри фильм и проведи день дома."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "rainy", "season": "summer", "suggestion":"Открываем окна, залезаем с ногами в кресло и наслаждаемся..."}'

#sunny
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "sunny", "season": "summer", "suggestion":"В Петербурге солнечно. Похоже, завтра конец света.", "author": "skotlov", "authorType": "twitter"}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "sunny", "season": "summer", "suggestion":"Дуй в ЦПКиО! Полежать вряд ли сможешь, но хоть стоя позагораешь."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "sunny", "season": "summer", "suggestion":"В Петербурге время солнечных очков, коротких юбок и сандалей без носков."}'
curl -X POST 'http://pogodable.ru/api/suggestions/' -H 'Content-Type: application/json' --data '{"cloudiness": "sunny", "season": "summer", "suggestion":"Солнышко - это хорошо. Солнышко - это к дождю.", "author": "lltwox", "authorType": "twitter"}'

