# Eccheuma

![something](https://firebasestorage.googleapis.com/v0/b/escapefrommordorland.appspot.com/o/GitHub%20Badge.png?alt=media&token=81247cc7-6f72-4f6c-9243-af32cdbdd52a)

[pixi-logo]: https://avatars.githubusercontent.com/u/5406849?s=100&v=4
[vue-logo]: https://avatars.githubusercontent.com/u/6128107?s=100&v=4
[firebase-logo]: https://avatars.githubusercontent.com/u/1335026?s=100&v=4
[nuxt-logo]: https://avatars.githubusercontent.com/u/23360933?s=100&v=4

## Технологии:

* [Vue](https://github.com/vuejs/vue)
* [Nuxt](https://github.com/nuxt)
* [Firebase](https://github.com/firebase/)
* [Anime.js](https://github.com/juliangarnier/anime)
* [Pixi.js](https://github.com/pixijs)

## Основные задачи приложения:
* Удобный доступ к портфолио и его подробное описание.
* Блог как для себя, так и для насыщения контентом.
* Перечень услуг, цен, сроков. С подробным описание технологий, инструментов, и сервисов.

---

## Небольшая предыстория становления приложения:
Изначально всё это, было не более чем сайт с галереей, картинками, контактами для связи, и блогом представляющим из себя куски текста. 
И так как это являлось как первой попыткой сделать что-то впервые, писалось это на чистом JS\CSS. А это, в свою очередь, не давало никакой надежды для БЫСТРОГО расширения функционала, по мере его поступления. Начались проблемы с внедрением функционала. Так этот феникс впервые сгорел, и начал своё первое перевоплощение...

Следующей попыткой была реализация сайта на JAM подходе. Был выбран шаблонизатор Jakyll, написанна разметка, впервые использован SASS для стилизации.
В этот же момент пришло осознание того, что компоненты - Это классная вещь. И написание нового сайта на костях старого было значительно быстрее. Но всё это лишь решило проблему шаблонизации. Идеи для функционал всё приходили. Навыки росли. Захотелось большего... Так феникс сгорел второй раз.

### Vue.js | Становление SPA.
На этот раз наступило знакомство со Vue. И пожалуй можно сказать, что именно с этого момента данный проект начал стоять на ногах более уверенно. Все та же идея компонентов, но теперь ещё с их стилизацией и разметкой в одном месте. Реактивность интерфейса. Роутинг меж страницами за место их полной перезагрузки. Процесс пошёл ещё быстрее. Так сайт начал превращаться в приложение. Некая эволюция из статического JAM сайта в новомодное SPA. Компоненты росли. Крепчали. Заводили себе состояния. Но и тут пришла проблема - Индексация контента поисковыми роботами. На тот момент единственный чьи поисковые роботы "рендерили" SPA приложения были Гугл. Ни Яндекс, и тем более не ребята по меньше этим не занимались. И казалось бы, и что? Трафик из поисковой выдачи крайне мал, и перестройка всего приложения не стоит всех тех пары лишних заходов клиентов. 

Но проблемы были куда серьёзнее: Производительность. Время до первой отрисовки. Долгое время простоя до интерактивности. И пожалуй самое серьёзное... большое... ОГРОМНОЕ количество зависимостей внутри приложения. Начиная от свайперов контента, заканчивая UI библеотекой, сеткой Bootstrap'а, и крайне простых зависимостей, которые накладывали свои ограничения. В данный момент это можно было сравнить с тем, что феникс навесив на себя реактивный двигатель, ракетную обшивку, и пару ракет "воздух-воздух" влетел в чан с мазутом, и начал в нём медленно тонуть.

### Nuxt.js | Падение SPA, и приход его альтернативы
И того, нужно было решить проблемы зависимостей и рендера. На сцену выходит Nuxt. Фреймворк для фреймворка. Который даёт возможность без сильный вложений переписать SPA приложение на SSR манер. Вместе с этим мы получаем возможность генерации контента для поисковых роботов. Более удобная экосистема и некоторые ограничения архитектуры. И если проблемы переноса приложения на Nuxt не вызвало какой-то большой проблемы, то избавление от большо количество зависимостей - Заняло более 5 месяцев.

Началась эпоха ренессанса...

### Typescript | Переход на TypeScript, переписывание зависимостей на свои решения, и рост в ширину. 
И так начался новый виток, ещё более занятный чем предыдущие. Началось осваивание TypeScript'а, что привнесло хоть какое-то подобие типизации в JS. Это же, в свою очередь, очень сильно сказалось что на уровне кода, количестве связанных с ним проблем, так и удобстве разработки.

Теперь же вместо компонентов которые берут "ЧТО-ТО" из "ЧЕГО-ТО", и пытаются это "ЧТО-ТО" обработать. Мы имеем полноценное представление о том какие данные нам приходят, с чем они связанны. 
```typescript
type POST = {
	ID: string,
	authorID: string
	comment: Array<COMMENT>
	content: POST_CONTENT
	likes?: Array<USER>
	...
}
```

---
