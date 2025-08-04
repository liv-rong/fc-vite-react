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
    let shouldRender = false
    active_objs.forEach((active_obj) => {
      const type = active_obj?.type
      console.log(type)
      if (type === 'textbox' || type === 'text' || type === 'i-text') {
        console.log((active_obj as fabric.Textbox).isEditing)
        if (!(active_obj as fabric.Textbox).isEditing) {
          canvas?.remove(active_obj)
          shouldRender = true
        }
      } else {
        canvas?.remove(active_obj)
        shouldRender = true
      }
    })
    if (shouldRender) {
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
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

  /**
   * 处理一组group 双击的时候可以编辑组内的元素
   * 组件元素 有文本可以编辑文本 如果有其他圆矩形 则可以拖拽缩放
   * 其他元素 则可以拖拽缩放
   * @description
   * @returns
   */
  private static editingGroup: fabric.Group | null = null
  private static originalStates: WeakMap<fabric.Object, any> = new WeakMap()

  /**
   * 处理Group双击编辑
   * @param group 被双击的Group对象
   * @param canvas 画布实例
   */
  static handleGroupEditing(group: fabric.Group, canvas: fabric.Canvas) {
    if (!group || !canvas) return

    console.log('handleGroupEditing')

    // 如果已经在编辑状态，则不做处理
    if (this.editingGroup === group) return

    // 结束之前的编辑状态
    this.endGroupEditing(canvas)

    // 递归处理所有对象（包括嵌套group中的对象）
    const processObjects = (objects: fabric.Object[]) => {
      console.log(objects, 'objects')
      objects.forEach((obj) => {
        console.log(obj, 'obj')

        // 如果是嵌套的group，递归处理其子对象
        if (obj instanceof fabric.Group) {
          processObjects(obj.getObjects())
        }

        // 保存原始状态
        this.originalStates.set(obj, {
          selectable: obj.selectable,
          evented: obj.evented,
          hasControls: obj.hasControls,
          hasBorders: obj.hasBorders,
          hoverCursor: obj.hoverCursor
        })

        // 设置为可编辑状态
        obj.set({
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          hoverCursor: 'move'
        })
      })
    }

    // 处理当前group的所有对象
    console.log(group, 'group')
    console.log(group.getObjects(), 'group.getObjects()')
    processObjects(group.getObjects())

    // 标记当前编辑的Group
    this.editingGroup = group
    canvas.renderAll()
  }
  /**
   * 结束Group编辑状态
   * @param canvas 画布实例
   */
  static endGroupEditing(canvas: fabric.Canvas) {
    if (!this.editingGroup || !canvas) return

    const objects = this.editingGroup.getObjects()
    objects.forEach((obj) => {
      const originalState = this.originalStates.get(obj)
      if (originalState) {
        obj.set(originalState)
      }
    })

    this.editingGroup = null
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  /**
   * 检查是否在Group编辑状态
   */
  static isEditingGroup(): boolean {
    return this.editingGroup !== null
  }

  /**
   * 获取当前编辑的Group
   */
  static getEditingGroup(): fabric.Group | null {
    return this.editingGroup
  }
}
