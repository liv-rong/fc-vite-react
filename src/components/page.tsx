import { Button } from 'antd'
import * as fabric from 'fabric'
import { useEffect, useRef, useState } from 'react'

import { useDeleteObjects } from '../hooks/use-event'
import { ExportPdf, ExportSvg, ImportSvg } from './index'

const FabricJSCanvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null)

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  useDeleteObjects(canvas)

  useEffect(() => {
    if (!canvasEl.current) return
    const options = {}
    const canvas = new fabric.Canvas(canvasEl.current, options)

    setCanvas(canvas)

    // 创建矩形
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      fill: 'red',
      left: 10,
      top: 10,
      x: 0,
      y: 0
    })

    canvas.add(rect)

    return () => {
      canvas.dispose()
    }
  }, [])

  //添加文本 到canvas中
  const handleText = () => {
    const iText = new fabric.IText('hello world', {
      fill: 'pink'
    })
    canvas?.add(iText)
  }

  useEffect(() => {
    if (!canvas) return
    canvas.on('mouse:dblclick', function (options) {
      console.log(options.target)
    })
  }, [canvas])

  return (
    <div className="flex flex-col h-screen w-screen bg-red-100">
      <div className="space-x-2">
        <ImportSvg canvas={canvas} />
        <ExportPdf canvas={canvas} />
        <ExportSvg canvas={canvas} />
        <Button onClick={handleText}>text</Button>
      </div>
      <div className="flex justify-center items-center bg-white h-calc(100vh - 100px) w-screen">
        <canvas
          width={800}
          height={800}
          className="border"
          ref={canvasEl}
        />
      </div>
    </div>
  )
}

export default FabricJSCanvas
