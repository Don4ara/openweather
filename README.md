<div align="center">

# ✻ openweather

### 🌤️ Красивый погодный TUI в стиле Claude Code

Терминальный прогноз погоды на 8 дней с ASCII-иконками, цветовыми акцентами<br/>и бар-чартами. Без API-ключей — на бесплатном [Open-Meteo](https://open-meteo.com).

<br/>

[![Bun](https://img.shields.io/badge/Bun-black?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Ink](https://img.shields.io/badge/Ink-TUI-cyan)](https://github.com/vadimdemedes/ink)
[![No API key](https://img.shields.io/badge/API%20key-not%20required-brightgreen)](https://open-meteo.com)

<br/>

⚙️ [**Расширенная настройка**](docs/ADVANCED.md) &nbsp;·&nbsp; 💬 [**Команды**](docs/COMMANDS.md) &nbsp;·&nbsp; 🏗️ [**Архитектура**](docs/ARCHITECTURE.md) &nbsp;·&nbsp; 🤝 [**Разработка**](.github/CONTRIBUTING.md)

</div>

---

<div align="center">

```
┌────────────────────────────────────────────────────────────┐
│  ✻ openweather        Погода в терминале · °C · m/s · ...    │
└────────────────────────────────────────────────────────────┘

  Агент  прогноз · Madrid, ES

      \   |   /     Madrid  ES
        .---.       26°C  переменная облачность  (35° / 19°)
    — (  ☼  ) —     ощущается 25°C
        `---'       💧 28%  ↑ 1.4 m/s  949 гПа
      /   |   \     🌅 07:02  🌇 21:38

                                    осадки      ветер
      ─────────────────────────────────────────────────────
      Сегодня 29   35° /  19°  переменная о           0%        2
      Завтра 30    35° /  20°  переменная о ▎         3%  █      3.2
      Вс 31        34° /  21°  переменная о           0%  █▌     4.8
      ...

  ❯ █ Введите город...
```

</div>

## 🚀 Установка

### Глобально через npm

```bash
npm install -g openweather
openweather Stockholm
```

После установки команда `openweather` доступна из любого места. Настройки
(избранное, язык, единицы) сохраняются в `~/.openweather/config.json`.

### Из исходников (Bun)

```bash
bun install
bun run dev Stockholm
```

Введи название города и нажми `Enter`. Выход — `Esc` или `Ctrl+C`.

```bash
bun run dev                 # город по умолчанию или первый избранный
bun run dev Москва --debug  # debug-режим
bun run build               # собрать standalone-бандл в dist/
npm install -g .            # установить локальную сборку глобально
```

## ✨ Возможности

- **📅 Прогноз на 8 дней** — макс/мин температура, осадки, ветер, восход/закат.
- **📊 Бар-чарты** — осадки и ветер показаны ASCII-полосками (`▏▎▍▌▋▊▉`).
- **🎨 Цвет по погоде** — рамка и акценты красятся под условие (солнце — жёлтый, дождь — синий, гроза — magenta, снег — cyan).
- **🌙 ASCII-иконки** — детальные иконки погоды с вариантами день/ночь.
- **📐 Две системы единиц** — метрические (°C, m/s) и имперские (°F, mph).
- **⭐ Избранное** — сохранение городов с быстрым доступом при запуске.
- **🌍 Два языка** — русский и английский.
- **🔓 Без ключей** — Open-Meteo + Nominatim, бесплатно и без регистрации.

## 💬 Команды

Набери `/` в поле ввода — появится список. `↑`/`↓` — выбор, `Tab` — автодополнение, `Enter` — выполнить.

| Команда  | Действие                                         |
| -------- | ------------------------------------------------ |
| `/lang`  | Сменить язык (ru ↔ en)                           |
| `/units` | Метрические ↔ имперские единицы (°C/m·s ↔ °F/mph) |
| `/save`  | Сохранить текущий город в избранное              |
| `/list`  | Показать избранные города                        |
| `/clear` | Очистить историю                                 |
| `/help`  | Показать список команд                           |
| `/quit`  | Выход                                            |

Полное описание — в [справочнике команд](docs/COMMANDS.md). Настройки (язык, единицы, избранное) сохраняются в `~/.openweather/config.json` — подробнее в [расширенной настройке](docs/ADVANCED.md).

## 🧩 Стек

Bun · TypeScript · React · [Ink](https://github.com/vadimdemedes/ink) (TUI) · Commander (CLI).

Обзор потока данных и структуры файлов — в [архитектуре](docs/ARCHITECTURE.md).

## 🛠️ Команды разработки

```bash
bun run dev              # запуск из исходников
bun run build            # сборка в dist/
bun run compile          # компиляция в один бинарник: ./openweather
bun run typecheck        # tsc --noEmit
```

Хочешь добавить фичу? См. [руководство по разработке](.github/CONTRIBUTING.md).

## 📄 Лицензия

См. [LICENSE](LICENSE).

<div align="center">
<br/>
<sub>Сделано с ✻ в терминале</sub>
</div>
