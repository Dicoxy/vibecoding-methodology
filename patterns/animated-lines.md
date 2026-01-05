# Паттерн: Анимированные SVG-линии к карточкам

## Задача

Создать анимированные линии, которые расходятся от одной точки к нескольким карточкам (услуги, продукты, и т.д.)

```
                    ╭────● [Карточка 1]
                    │
         ●──────────┼────● [Карточка 2]
       origin       │
                    ╰────● [Карточка 3]
```

## Проблема

SVG-линии требуют точных координат. Если координаты захардкодить — они сломаются при:
- Изменении контента карточек
- Разных размерах экрана
- Добавлении/удалении карточек

## Решение

Динамический расчёт координат через `getBoundingClientRect()`:

1. Получаем refs на все целевые элементы (иконки карточек)
2. Вычисляем их позиции относительно контейнера
3. Строим SVG path динамически
4. Пересчитываем при resize

## ⚠️ Критичные ошибки (мы на них потратили 2 часа)

### Ошибка 1: Анимация позиции целевых элементов

```tsx
// ❌ ПЛОХО — координаты будут неверными
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
>

// ✅ ХОРОШО — только opacity
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
```

**Почему:** `getBoundingClientRect()` вызывается до завершения анимации и получает промежуточные координаты.

### Ошибка 2: Бесконечный цикл при обновлении refs

```tsx
// ❌ ПЛОХО — infinite loop
const [iconRefs, setIconRefs] = useState([])
const handleRef = (el) => {
  setIconRefs(prev => [...prev, el])  // вызывает ре-рендер → снова handleRef
}

// ✅ ХОРОШО — useRef не вызывает ре-рендер
const iconRefs = useRef([])
const handleRef = (index, el) => {
  iconRefs.current[index] = el
}
```

### Ошибка 3: Линии пересекают иконки

```tsx
// ❌ ПЛОХО — линия идёт прямо в центр иконки
const endX = iconRect.left - containerRect.left

// ✅ ХОРОШО — останавливаемся перед иконкой
const endX = iconRect.left - containerRect.left - 15
```

## Готовый компонент

→ [components/AnimatedLines.tsx](../components/AnimatedLines.tsx)

## Использование

```tsx
import AnimatedLines from '@/components/ui/AnimatedLines'

// В компоненте:
const containerRef = useRef(null)
const originRef = useRef(null)
const targetRefs = useRef([null, null, null])

<div ref={containerRef} style={{ position: 'relative' }}>
  <AnimatedLines
    containerRef={containerRef}
    originRef={originRef}
    targetRefs={targetRefs.current}
    colors={['#00ff88', '#3b82f6', '#f59e0b']}
    isInView={isInView}
    pattern="fan"
  />
  
  <div ref={originRef}>Точка старта</div>
  
  {cards.map((card, i) => (
    <Card 
      key={i}
      ref={(el) => { targetRefs.current[i] = el }}
    />
  ))}
</div>
```

## Параметры компонента

| Параметр | Тип | Описание |
|----------|-----|----------|
| containerRef | RefObject | Контейнер с position: relative |
| originRef | RefObject | Точка старта линий |
| targetRefs | Element[] | Массив целевых элементов |
| colors | string[] | Цвета линий |
| isInView | boolean | Триггер анимации |
| pattern | 'fan' \| 'straight' | Паттерн линий |

## Паттерны линий

### fan (по умолчанию)
Верхние линии идут вверх, средняя прямо, нижние вниз

### straight
Все линии — плавные S-кривые напрямую к цели.

---

*Источник: проект СисТех, январь 2026*
*Время на решение: ~2 часа отладки*
