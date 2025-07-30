import { Button } from 'antd'
import * as fabric from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { useDeleteObjects } from '../hooks/use-event'
import { ExportPdf, ExportSvg, ImportSvg } from './index'
import { CanvasUtils } from '../utils/canvas'

const FabricJSCanvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  useDeleteObjects(canvas)

  useEffect(() => {
    if (!canvasEl.current) return

    const canvas = new fabric.Canvas(canvasEl.current, {
      skipOffscreen: true,
      enableRetinaScaling: false,
      imageSmoothingEnabled: false,
      preserveObjectStacking: true,
      hoverCursor: 'move',
      selection: true,
      subTargetCheck: true, // 启用子对象检测
      targetFindTolerance: 10 // 增加目标检测容差
    })

    setCanvas(canvas)

    // 创建示例对象
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      fill: 'red',
      left: 10,
      top: 10,
      selectable: false, // 初始不可选
      evented: false // 初始不响应事件
    })

    const text = new fabric.Textbox('双击编辑文本', {
      left: 50,
      top: 30,
      width: 150,
      fontSize: 20,
      fill: 'white',
      selectable: false, // 初始不可选
      evented: false, // 初始不响应事件
      editable: false // 初始不可编辑
    })

    const circle = new fabric.Circle({
      radius: 30,
      fill: 'blue',
      left: 150,
      top: 50,
      selectable: false,
      evented: false
    })

    const group = new fabric.Group([rect, text, circle], {
      left: 100,
      top: 100,
      subTargetCheck: true, // 允许检测子对象
      interactive: true
    })

    canvas.add(group)

    // 点击空白处结束编辑
    canvas.on('mouse:down', (e) => {
      if (!e.target && CanvasUtils.isEditingGroup()) {
        CanvasUtils.endGroupEditing(canvas)
      }
    })

    // 双击Group进入编辑模式
    canvas.on('mouse:dblclick', (e) => {
      if (e.target && e.target instanceof fabric.Group) {
        CanvasUtils.handleGroupEditing(e.target, canvas)
      }
    })

    // 点击其他对象结束编辑
    canvas.on('selection:created', (e) => {
      if (CanvasUtils.isEditingGroup() && e.target) {
        const editingGroup = CanvasUtils.getEditingGroup()
        if (editingGroup && !editingGroup.contains(e.target)) {
          CanvasUtils.endGroupEditing(canvas)
        }
      }
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  // 添加文本
  const handleText = () => {
    const text = new fabric.Textbox('双击编辑文本', {
      fill: 'pink',
      width: 200,
      fontSize: 20,
      editable: true
    })
    canvas?.add(text)
    canvas?.setActiveObject(text)
    text.enterEditing()
    text.selectAll()
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <div className="space-x-2 p-2 bg-white shadow">
        <ImportSvg canvas={canvas} />
        <ExportPdf canvas={canvas} />
        <ExportSvg canvas={canvas} />
        <Button onClick={handleText}>添加文本</Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white shadow-lg inline-block">
          <canvas
            width={800}
            height={800}
            className="border border-gray-300"
            ref={canvasEl}
          />
        </div>
      </div>
    </div>
  )
}

export default FabricJSCanvas
