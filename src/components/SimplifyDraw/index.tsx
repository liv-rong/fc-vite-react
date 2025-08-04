import { DrawBoard } from '@helix/simplify-draw'
import type { DrawBoardRef } from '@helix/simplify-draw'
import React, { useRef } from 'react'

const style = {
  '--color-primary-draw': 'green'
}

const ImgSelectListType = [
  {
    label: '自定义图标图标',
    icon: '',
    onClick: () => {
      console.log('自定义图标')
    }
  }
]

const DrawBoardDemo: React.FC = () => {
  const drawBoardRef = useRef<DrawBoardRef>(null)

  const handleRedo = () => {
    drawBoardRef.current?.redo()
  }

  const handleUndo = () => {
    drawBoardRef.current?.undo()
  }

  const handleClearCanvas = () => {
    drawBoardRef.current?.clearCanvas()
  }

  const handleSetSize = () => {
    drawBoardRef.current?.setSize(800, 600)
  }

  const handleAddImg = () => {
    drawBoardRef.current?.addImg('example-image-url')
  }

  const handleExportSvg = () => {
    const svg = drawBoardRef.current?.exportSvg()
    console.log(svg)
  }

  const handleExportPng = () => {
    const png = drawBoardRef.current?.exportPng()
    console.log(png)
  }

  return (
    <div style={{ height: '800px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div onClick={handleRedo}>redo</div>
        <div onClick={handleUndo}>undo</div>
        <div onClick={handleClearCanvas}>clearCanvas</div>
        <div onClick={handleSetSize}>setSize</div>
        <div onClick={handleAddImg}>addImg</div>
        <div onClick={handleExportSvg}>exportSvg</div>
        <div onClick={handleExportPng}>exportPng</div>
      </div>
      <DrawBoard
        width={800}
        height={1200}
        ref={drawBoardRef}
        imgSelectList={ImgSelectListType}
        style={style}
      />
    </div>
  )
}

export default DrawBoardDemo
