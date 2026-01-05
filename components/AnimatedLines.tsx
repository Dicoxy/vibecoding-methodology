'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * AnimatedLines — компонент для анимированных SVG линий от точки к карточкам
 * 
 * ВАЖНО: Целевые элементы (targetRefs) НЕ должны иметь анимацию position (x, y).
 * Только opacity! Иначе координаты будут рассчитаны неверно.
 * 
 * @example
 * <AnimatedLines
 *   containerRef={containerRef}
 *   originRef={originRef}
 *   targetRefs={[cardRef1, cardRef2, cardRef3]}
 *   colors={['#00ff88', '#3b82f6', '#f59e0b']}
 *   isInView={isInView}
 *   pattern="fan" // fan = верхняя вверх, средняя прямо, нижняя вниз
 * />
 */

interface AnimatedLinesProps {
  containerRef: React.RefObject<HTMLElement | HTMLDivElement>
  originRef: React.RefObject<HTMLElement | HTMLDivElement>
  targetRefs: (HTMLElement | HTMLDivElement | null)[]
  colors: string[]
  isInView: boolean
  pattern?: 'fan' | 'straight'  // fan = расходящиеся, straight = все прямые
  strokeWidth?: number
  animationDelay?: number       // базовая задержка перед стартом
  animationStagger?: number     // задержка между линиями
}

interface PathData {
  d: string
  color: string
  delay: number
  endX: number
  endY: number
}

export default function AnimatedLines({
  containerRef,
  originRef,
  targetRefs,
  colors,
  isInView,
  pattern = 'fan',
  strokeWidth = 2,
  animationDelay = 0.4,
  animationStagger = 0.3,
}: AnimatedLinesProps) {
  const [paths, setPaths] = useState<PathData[]>([])
  const [originPoint, setOriginPoint] = useState({ x: 0, y: 0 })

  const calculatePaths = useCallback(() => {
    if (!originRef.current || !containerRef.current) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const originRect = originRef.current.getBoundingClientRect()
    
    // Точка старта относительно контейнера
    const originX = originRect.left + originRect.width / 2 - containerRect.left
    const originY = originRect.top + originRect.height / 2 - containerRect.top
    
    setOriginPoint({ x: originX, y: originY })
    
    const newPaths: PathData[] = []
    const radius = 20 // радиус скругления
    
    targetRefs.forEach((targetEl, index) => {
      if (!targetEl) return
      
      const targetRect = targetEl.getBoundingClientRect()
      // Точка слева от таргета с отступом
      const endX = targetRect.left - containerRect.left - 15
      const endY = targetRect.top + targetRect.height / 2 - containerRect.top
      
      let path: string
      
      if (pattern === 'straight') {
        // Все линии — плавные кривые напрямую
        const ctrlX = originX + (endX - originX) * 0.5
        path = `M ${originX},${originY} C ${ctrlX},${originY} ${ctrlX},${endY} ${endX},${endY}`
      } else {
        // Fan pattern: верхняя вверх, средняя прямо, нижняя вниз
        const turnX = endX - 50 // точка поворота близко к карточкам
        const totalTargets = targetRefs.length
        const middleIndex = Math.floor(totalTargets / 2)
        
        if (index < middleIndex) {
          // Верхние карточки — линия идёт ВВЕРХ потом ВПРАВО
          path = `
            M ${originX},${originY}
            L ${turnX - radius},${originY}
            Q ${turnX},${originY} ${turnX},${originY - radius}
            L ${turnX},${endY + radius}
            Q ${turnX},${endY} ${turnX + radius},${endY}
            L ${endX},${endY}
          `
        } else if (index === middleIndex) {
          // Средняя карточка — плавная S-кривая
          const ctrlX = originX + (endX - originX) * 0.5
          path = `M ${originX},${originY} C ${ctrlX},${originY} ${ctrlX},${endY} ${endX},${endY}`
        } else {
          // Нижние карточки — линия идёт ВНИЗ потом ВПРАВО
          path = `
            M ${originX},${originY}
            L ${turnX - radius},${originY}
            Q ${turnX},${originY} ${turnX},${originY + radius}
            L ${turnX},${endY - radius}
            Q ${turnX},${endY} ${turnX + radius},${endY}
            L ${endX},${endY}
          `
        }
      }
      
      newPaths.push({
        d: path.replace(/\s+/g, ' ').trim(),
        color: colors[index] || colors[0],
        delay: animationDelay + index * animationStagger,
        endX,
        endY,
      })
    })
    
    setPaths(newPaths)
  }, [originRef, targetRefs, containerRef, colors, pattern, animationDelay, animationStagger])

  useEffect(() => {
    // Расчёт с небольшой задержкой для рендера
    const timer = setTimeout(calculatePaths, 100)
    
    // Пересчёт при resize
    const handleResize = () => calculatePaths()
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [calculatePaths])

  if (paths.length === 0) return null

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Origin point */}
      <motion.circle
        cx={originPoint.x}
        cy={originPoint.y}
        r="6"
        fill="#0a0a0f"
        stroke={colors[0]}
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: animationDelay - 0.1 }}
      />
      
      {/* Animated paths */}
      {paths.map((path, index) => (
        <g key={index}>
          <motion.path
            d={path.d}
            fill="none"
            stroke={path.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: path.delay }}
          />
          {/* End point */}
          <motion.circle
            cx={path.endX}
            cy={path.endY}
            r="4"
            fill={path.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: path.delay + 0.7 }}
          />
        </g>
      ))}
    </svg>
  )
}
