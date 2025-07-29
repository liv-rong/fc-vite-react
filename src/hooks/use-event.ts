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

  useEffect(() => {
    return document.removeEventListener('keydown', () => canvas && CanvasUtils.delShape(canvas))
  }, [])
}
