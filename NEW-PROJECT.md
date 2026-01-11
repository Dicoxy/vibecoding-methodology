# Как начать новый проект

## Шаг 1: Создать Project в Claude.ai

1. Открыть claude.ai → Projects → "Create Project"
2. Название: имя клиента/сайта
3. В **Knowledge** добавить:
   - `methodology-v031.md` (из этого репозитория)
   - `QUICKSTART.md` (из этого репозитория)
   - `checklists/security.md` (из этого репозитория)
   - Бриф клиента (когда будет готов)

## Шаг 2: Создать репозиторий для сайта

```bash
# На GitHub создать новый репозиторий: [client-name]-landing

# Локально:
git clone https://github.com/[user]/[client-name]-landing
cd [client-name]-landing
```

## Шаг 3: Скопировать шаблоны

Скопировать из `templates/` этого репозитория:

```
[client-name]-landing/
├── CLAUDE.md              ← скопировать и заполнить
└── .brief/
    ├── client-brief.md    ← скопировать и заполнить
    ├── content.md         ← скопировать и заполнить
    ├── tasks.md           ← скопировать
    └── references/        ← сюда скриншоты референсов
```

## Шаг 4: Заполнить под клиента

1. **CLAUDE.md** — заменить [PLACEHOLDER] на реальные данные
2. **client-brief.md** — заполнить бриф от клиента
3. **content.md** — добавить тексты для сайта

## Шаг 5: Начать работу по методологии

Следовать `QUICKSTART.md`:
1. Фаза 0: Проверить что материалы готовы
2. Фаза 1: Планирование структуры
3. Фаза 2: HTML-мокапы
4. ...

---

## Структура готового проекта

```
[client-name]-landing/
├── CLAUDE.md                    # Контекст для Claude Code
├── .brief/
│   ├── client-brief.md          # Бриф клиента
│   ├── content.md               # Тексты
│   ├── content-[product].md     # Доп. контент (если нужно)
│   ├── tasks.md                 # Задачи
│   └── references/
│       ├── screenshot-*.png     # Скриншоты референсов
│       └── *-mockup.html        # HTML-мокапы (временно)
├── app/                         # Next.js App Router
├── components/
│   ├── ui/                      # Переиспользуемые компоненты
│   └── sections/                # Секции страницы
├── public/                      # Статика
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Что НЕ нужно копировать

- Компоненты из `components/` — копируются по необходимости
- Паттерны из `patterns/` — это документация, читается при необходимости

## Связь с методологией

Claude Code/Chat получает ссылку на этот репозиторий:
```
Методология: https://github.com/Dicoxy/vibecoding-methodology
Прочитай QUICKSTART.md перед началом работы.
```

И работает в репозитории конкретного проекта.
