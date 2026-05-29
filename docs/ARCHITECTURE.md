<div align="center">

# 🏗️ Архитектура

[⬅ Назад к README](../README.md)

</div>

---

## Поток данных

```
main.tsx → cli.tsx (Commander) → render <App> (Ink)
  │
  └─ App holds state: query, weather, messages, loading, lang, units, favorites
        │
        ├─ on query/lang/units change → getWeather(city, lang, units)
        │     ├─ geocode(city)  → Open-Meteo geocoding → fallback Nominatim
        │     └─ fetch forecast → api.open-meteo.com
        │
        └─ result → messages[] as {role: 'forecast', weather}
```

## Модель чата

`messages: ChatMessage[]` — это union ролей, рендерится как прокручиваемый лог диалога:

```ts
type ChatMessage =
  | {role: 'user' | 'tool' | 'error'; text: string}
  | {role: 'forecast'; weather: WeatherResult};
```

- `user` — ввод пользователя
- `forecast` — карточка погоды + таблица на 8 дней
- `tool` — информационные сообщения (результат `/save`, `/list`, `/help` и т.д.)
- `error` — ошибки (город не найден, сбой сети)

Хедер (`AppHeader`) всегда сверху и красится в акцентный цвет последнего прогноза.

## Структура файлов

| Путь                          | Роль                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| `src/main.tsx`                | Точка входа, вызывает `runCli()`                            |
| `src/cli.tsx`                 | Commander: парсинг аргументов, загрузка конфига, рендер     |
| `src/app/App.tsx`             | Всё состояние, обработка команд, эффекты загрузки           |
| `src/services/weather.ts`     | Геокодинг + прогноз + маппинг WMO-кодов + `iconColor()`     |
| `src/services/units.ts`       | Конфиг единиц (metric/imperial), конвертация для цвета      |
| `src/services/storage.ts`     | Чтение/запись `~/.openweather/config.json`                  |
| `src/components/AppHeader.tsx`| Верхняя панель: логотип + единицы, акцентная рамка          |
| `src/components/Message.tsx`  | Рендер записей истории + бар-чарты осадков/ветра            |
| `src/components/WeatherIcon.tsx`| ASCII-иконки погоды с вариантами день/ночь                |
| `src/components/PromptInput.tsx`| Поле ввода (голый `useInput`), мигающий курсор, команды   |
| `src/components/StatusBar.tsx`| Нижняя панель подсказок                                     |
| `src/components/Spinner.tsx`  | Анимация загрузки                                           |
| `src/i18n/index.ts`           | Переводы ru/en + `wmoToCondition()`                         |

## Ключевые механики

**Геокодинг с фолбэком.** `geocode()` сначала бьёт в Open-Meteo. Если результата нет — фолбэк на Nominatim (с обязательным `User-Agent`). Обе пустые → ошибка «Город не найден».

**Бар-чарты.** `bar(value, max, width)` в `Message.tsx` строит пропорциональную полоску из `█` + дробные блоки `▏▎▍▌▋▊▉`. Дробь, округлившаяся в 8/8, переносится в полный блок (иначе `PARTIALS[8]` → `undefined`).

**Цвет по погоде.** `iconColor(iconType)` мапит условие в цвет акцента (солнце → жёлтый, дождь → синий, гроза → magenta, снег → cyan). Используется в хедере и карточке прогноза.

**День/ночь.** Текущая погода берёт `is_day` из API; `WeatherIcon` показывает ночные варианты (солнце → луна, переменная облачность ночью).

**Обработка ресайза.** `App` слушает `process.stdout.on('resize')` и форсит перерисовку через `\x1B[2J\x1B[H`.

**Персист.** `useEffect` сохраняет `{favorites, lang, units}` в конфиг при любом изменении. Запись best-effort — ошибки игнорируются.

## Стек

Bun · TypeScript · React · [Ink](https://github.com/vadimdemedes/ink) · Commander.

Без API-ключей. Без тестов.
