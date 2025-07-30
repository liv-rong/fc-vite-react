//添加键盘事件支持
import { useEffect } from 'react'
import * as fabric from 'fabric'
import { CanvasUtils } from '../utils/canvas'

export const useDeleteObjects = (canvas: fabric.Canvas | null) => {
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (canvas) {
          CanvasUtils.delShape(canvas)
        }
      }
    },
    { passive: true }
  )

  // 监听键盘的上下左右键，移动选中的元素
  document.addEventListener(
    'keydown',
    (e) => {
      if (!canvas) return
      const activeObject = canvas.getActiveObject()
      if (!activeObject) return

      let moved = false
      switch (e.key) {
        case 'ArrowUp':
          activeObject.top = (activeObject.top || 0) - 1
          moved = true
          break
        case 'ArrowDown':
          activeObject.top = (activeObject.top || 0) + 1
          moved = true
          break
        case 'ArrowLeft':
          activeObject.left = (activeObject.left || 0) - 1
          moved = true
          break
        case 'ArrowRight':
          activeObject.left = (activeObject.left || 0) + 1
          moved = true
          break
      }
      if (moved) {
        activeObject.setCoords()
        canvas.requestRenderAll()
        e.preventDefault()
      }
    },
    { passive: false }
  )

  useEffect(() => {
    return document.removeEventListener('keydown', () => canvas && CanvasUtils.delShape(canvas))
  }, [])
}
