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

  const createNestedGroups = (canvas: fabric.Canvas) => {
    // 最内层元素
    const innerRect = new fabric.Rect({
      width: 100,
      height: 50,
      fill: 'green',
      left: 10,
      top: 10,
      selectable: false, // 初始不可选
      evented: false // 初始不响应事件
    })
    const innerText = new fabric.Textbox('内层文本', {
      left: 20,
      top: 15,
      fontSize: 14,
      fill: 'white',
      selectable: false, // 初始不可选
      evented: false // 初始不响应事件
    })

    // 外层元素
    const outerRect = new fabric.Rect({
      width: 300,
      height: 200,
      fill: 'rgba(100,100,255,0.5)',
      left: 0,
      top: 0,
      selectable: false, // 初始不可选
      evented: false // 初始不响应事件
    })
    const outerText = new fabric.Textbox('外层文本', {
      left: 100,
      top: 80,
      fontSize: 20,
      fill: 'black',
      selectable: false, // 初始不可选
      evented: false // 初始不响应事件
    })
    // 中间层Group
    const middleGroup = new fabric.Group([innerRect, innerText], {
      left: 50,
      top: 50,
      subTargetCheck: true, // 允许检测子对象
      interactive: false
    })
    // 中间层Group
    const middleGroup1 = new fabric.Group([outerRect, outerText], {
      left: 50,
      top: 50,
      subTargetCheck: true, // 允许检测子对象
      interactive: false
    })

    // 最外层Group
    const mainGroup = new fabric.Group([middleGroup, middleGroup1], {
      left: 100,
      top: 100,
      subTargetCheck: true,
      interactive: true
    })

    canvas.add(mainGroup)
  }

  const addShape = (canvas: fabric.Canvas) => {
    const shape = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
      subTargetCheck: true,
      evented: false // 初始不响应事件
    })
    const text = new fabric.Textbox('双击编辑文本', {
      left: 50,
      top: 150,
      fontSize: 20,
      fill: 'black',
      selectable: false,
      subTargetCheck: true,
      evented: false // 初始不响应事件
    })

    const group = new fabric.Group([shape, text], {
      left: 50,
      top: 50,
      subTargetCheck: true,
      interactive: true
    })

    canvas.add(group)
  }

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

    // createNestedGroups(canvas)
    addShape(canvas)

    // 点击空白处结束编辑
    // 事件处理
    canvas.on('mouse:down', (e) => {
      if (!e.target && CanvasUtils.isEditingGroup()) {
        CanvasUtils.endGroupEditing(canvas)
      }
    })

    canvas.on('mouse:dblclick', (e) => {
      if (e.target && e.target instanceof fabric.Group) {
        CanvasUtils.handleGroupEditing(e.target, canvas)
      }
    })

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
