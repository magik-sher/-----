# SHER — The Art of Impossible

Новая версия сайта, собранная с нуля на основе последней доступной сборки SHER и двух переданных ZIP-анимаций.

## Запуск
1. Распакуйте архив.
2. Откройте `index.html` обычным двойным щелчком в браузере.

Переход портала и анимация карт реализованы локальными HTML/CSS/JavaScript-файлами. Сцены находятся в `images`, а при недоступности Deck of Cards API колода генерируется локально. Google Fonts необязательны.

Сервер, WebGL и CDN для запуска первого экрана не требуются.

## Что использовано из материалов SHER
- фотографии и QR-коды из `Sher-website-from-scratch.zip`;
- данные о программах, продолжительности, стоимости и контактах из последней сборки/презентации;
- сохранены реальные имена файлов изображений, без внешних фотозаглушек.

## Интерактивные эффекты
- `js/portal-transition.js`: сцены плавно раскрываются при прокрутке в порядке «кулисы → кролик → иллюзионист»; при прокрутке вверх переход идёт в обратном направлении.
- `js/magic-stage.js` и `.card-cascade` в `css/editorial.css`: каскад из 36 игральных карт заменяет фотографию фокуса с картами в блоке «О SHER».
- `effects/card-flip.js` + `css/card-flip.css`: трёхмерные карточки с переворотом, подсветкой, тенями, hover/focus/tap и автозакрытием соседней карточки.
- Исходные файлы эффекта прожекторов сохранены в `effects/` и `css/spotlight.css`; каскад карт находится в разделе «О SHER».

Оригинальные README и START-HERE-AI файлы анимаций сохранены в `effects/`.

## Изменение данных
Основные тексты, цены, продолжительность, телефоны, ссылки и пути к изображениям находятся в `index.html`.
Основная визуальная система и адаптивность — `css/site.css`.

## Важная проверка перед публикацией
Проверить фактический рендеринг в Chrome/Firefox и на реальном телефоне, особенно 3D-сцену и переворот карточек.


## Revision: hero image and 3D card interaction
- The opening hero now begins with the supplied theatre-curtain image and changes through the supplied rabbit and stage-performer images via the portal transition.
- Cards use `data-flip="hover"`: desktop hover/focus opens them; touch devices toggle them by tap through `effects/card-flip.js`.
- `js/site.js` intentionally no longer overwrites each card's `data-flip` mode.
- `effects/card-flip.js` uses its local CSS interaction fallback when GSAP is not present, so program cards remain usable from `file://`.

## Revision: editorial visual restyle
- `css/editorial.css` adds the reference-inspired composition: rounded layered panels, softer framing, and a more spacious editorial rhythm.
- Existing color tokens, page copy, translations, prices, contact links, and image files are retained.
- Source photographs are shown without CSS color filters. The original image files are unchanged.
- `index.html` loads this stylesheet after the existing site stylesheet so the visual restyle remains easy to adjust independently.

## Revision: portal hero and card cascade
- Первый экран открывается театральными кулисами; при прокрутке они сменяются кроликом в цилиндре, затем иллюзионистом на сцене. Нажимать на экран не нужно, видимой рамки портала нет.
- Каскад из 36 карт заменяет крупное фото фокуса с картами в разделе «О SHER»; третья программная карточка сохраняет своё изображение.
- Переход и карточная анимация работают из `index.html` напрямую — без WebGL, сервера, CDN и ES-модулей.

## Revision: integrated three-frame portal
- Главный экран использует полноэкранную анимацию кулисы → кролик → иллюзионист с затемнением и зумом через глаза кролика.
- Колесо мыши, клавиши и свайп переводят между тремя остановками по одному кадру; прокрутка сайта вниз разблокируется только после завершения третьего кадра.
- На каждом кадре показывается отдельная информационная панель на русском языке. Изображения и остальные разделы сайта сохранены.
- Информация показана поверх сцен без прямоугольной подложки и двойной рамки; боковая панель соцсетей тоже без прямоугольного фона.
- Каскад карт использует размеры сцены `30em × 14em`, исходный поворот от верхнего края и 36 CSS-анимаций с разнесённым запуском; прежний дизайн карт сохранён. Рамка блока и подпись `UP CLOSE / NO TRICKS / JUST MAGIC` удалены.
- Тень теперь идёт по видимому контуру карточки, а не по широкой 3D-плоскости.
- Проект запускается напрямую двойным щелчком по `index.html`.

## Revision: responsive typography and alignment
- Уменьшены заголовки портала, основных разделов и программных карточек на больших экранах и телефонах.
- Общие текстовые колонки разделов выровнены по единой ширине; сетки адаптированы для планшетов и мобильных экранов.
- Числа статистики остаются в одной строке, подписи переносятся между словами без разрыва слов.
- Текст, палитра, фотографии и анимации сохранены.

## Revision: animated SHER intro
- Перед сайтом показывается трёхсекундная световая анимация логотипа SHER, затем заставка плавно исчезает.
- Фон заставки совпадает с базовым фоном страницы (`#050b14`); анимация встроена в проект и не требует внешней библиотеки.
- На время заставки отключены прокрутка и управление сайтом; при настройке reduced motion движение света отключается.

## Revision: larger readable type
- Слегка увеличен размер основных заголовков, текста разделов, статистики и описаний карточек на компьютерах и телефонах.
- Сохранены сетки, интервалы и переносы по словам, чтобы увеличенные буквы не накладывались друг на друга.
