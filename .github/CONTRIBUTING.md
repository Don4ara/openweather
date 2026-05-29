<div align="center">

# 🤝 Разработка

[⬅ Назад к README](../README.md)

</div>

---

## Окружение

Нужен [Bun](https://bun.sh). Зависимости:

```bash
bun install
```

## Цикл разработки

```bash
bun run dev Stockholm    # запуск из исходников с hot-перезапуском
bun run typecheck        # проверка типов (tsc --noEmit)
bun run build            # бандл в dist/
bun run compile          # автономный бинарник
```

Тестов в проекте нет.

## Стиль кода

- TypeScript, строгие типы. Перед коммитом — `bun run typecheck`.
- React-функциональные компоненты, состояние держится в `App.tsx`.
- UI-строки — только через `src/i18n/index.ts` (ru + en), не хардкодить текст в компонентах.
- Цвета — стандартные имена chalk/Ink (`cyan`, `yellowBright`, `gray` и т.д.).

## Куда добавлять

| Хочешь...                       | Файл                                    |
| ------------------------------- | --------------------------------------- |
| Новую slash-команду             | `App.tsx` (`commands[]` + `handleCommand`) + строки в `i18n` |
| Новое поле погоды               | `services/weather.ts` (`WeatherResult`) + рендер в `Message.tsx` |
| Новую иконку погоды             | `services/weather.ts` (`wmoToCondition`) + `WeatherIcon.tsx`     |
| Новый язык                      | `src/i18n/index.ts` (новый ключ в `translations`)               |
| Новую единицу измерения         | `services/units.ts` (`unitConfig`)      |

## Локализация

Добавить язык: новый ключ в `translations` (`i18n/index.ts`) со всеми полями существующих языков, затем расширить тип `Lang` и логику переключения в `/lang`.

## Перед PR

1. `bun run typecheck` — без ошибок.
2. `bun run dev <город>` — проверить рендер вживую.
3. Проверить оба языка (`/lang`) и обе системы единиц (`/units`).
