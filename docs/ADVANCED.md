<div align="center">

# ⚙️ Расширенная настройка

[⬅ Назад к README](../README.md)

</div>

---

## Глобальная установка

Скомпилируй в один исполняемый файл и положи в `PATH`:

```bash
bun run compile          # создаёт ./openweather
mv openweather /usr/local/bin/
openweather Stockholm
```

Либо запускай готовый бинарник из репозитория:

```bash
./bin/openweather Москва --debug
```

## Файл конфигурации

Настройки сохраняются автоматически в `~/.openweather/config.json`:

```json
{
  "favorites": ["Москва", "Stockholm", "Tokyo"],
  "lang": "ru",
  "units": "metric"
}
```

| Поле        | Значения                | Описание                          |
| ----------- | ----------------------- | --------------------------------- |
| `favorites` | массив строк            | Сохранённые города (`/save`)      |
| `lang`      | `ru` \| `en`            | Язык интерфейса (`/lang`)         |
| `units`     | `metric` \| `imperial`  | Система единиц (`/units`)         |

При запуске без аргумента используется первый город из `favorites`, иначе — `Stockholm`.

Файл можно править вручную — изменения подхватятся при следующем запуске. Если файл повреждён или недоступен на запись, приложение тихо откатывается на значения по умолчанию.

## Единицы измерения

| Система     | Температура | Ветер | Переключение |
| ----------- | ----------- | ----- | ------------ |
| `metric`    | °C          | m/s   | `/units`     |
| `imperial`  | °F          | mph   | `/units`     |

Запрос к API делается с нужными единицами, конвертация на стороне Open-Meteo.

## Источники данных

| Сервис                                          | Назначение                        |
| ----------------------------------------------- | --------------------------------- |
| [Open-Meteo Forecast](https://open-meteo.com)   | Прогноз и текущая погода          |
| [Open-Meteo Geocoding](https://open-meteo.com)  | Геокодинг (основной)              |
| [Nominatim](https://nominatim.openstreetmap.org)| Геокодинг (фолбэк)                |

Все — бесплатные и без API-ключей. Nominatim вызывается с `User-Agent: openweather-cli/0.1.0` согласно их [правилам использования](https://operations.osmfoundation.org/policies/nominatim/).

## Сборка

```bash
bun run build            # бандл в dist/ (target=node)
bun run compile          # автономный бинарник ./openweather
bun run typecheck        # tsc --noEmit
```
