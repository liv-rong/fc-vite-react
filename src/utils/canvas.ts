import * as fabric from 'fabric'
import { BrowserUtils } from './browser'

export class CanvasUtils {
  /**
   * 删除选择中的对象
   * @description
   * @returns
   */
  static delShape = (canvas: fabric.Canvas) => {
    const active_objs = canvas?.getActiveObjects()
    for (const i in active_objs) {
      const active_obj = active_objs[Number(i)]
      const type = active_obj?.type
      if (type === 'textbox' || type === 'text' || type === 'i-text') {
        if (!(active_obj as fabric.Textbox).isEditing) {
          canvas?.remove(active_obj)
        }
      } else {
        canvas?.remove(active_obj)
      }
    }
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  /**
   * 通过画布单个导出画布为svg
   * @description
   * @returns svg图片格式
   */
  static exportCanvasSvg = (canvas: fabric.Canvas | null) => {
    if (!canvas) return
    const svgData = canvas.toSVG()
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    BrowserUtils.downloadFile(url, 'image.svg')
  }
}
