import { DrawBoard } from '@helix/draw-board'
import { useState, useRef } from 'react'
import { jsonData1, jsonData } from './data' // ????
import type { DrawBoardRef, DrawBoardProps } from '@helix/draw-board'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button, Modal } from 'antd'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [edit, setEdit] = useState(false)

  const flowChartRef = useRef<DrawBoardRef>(null)

  const handleImportJson = () => {
    flowChartRef.current?.importJson(JSON.stringify(jsonData1))
    setEdit(false)
  }

  const handleImportJson2 = () => {
    flowChartRef.current?.importJson(JSON.stringify(jsonData))
    setEdit(false)
  }

  const showModal = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      handleImportJson()
    }, 100)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen bg-red-100 min-w-[1200px]">
        <div className="h-[200px]">
          <Button
            type="primary"
            onClick={showModal}
          >
            Open Modal
          </Button>
        </div>
        <Modal
          title={
            <div>
              <Button onClick={() => setEdit(!edit)}>{edit ? '预览' : '编辑'}</Button>
              <Button onClick={handleImportJson}>导入JSON1</Button>
              <Button onClick={handleImportJson2}>导入JSON2</Button>
            </div>
          }
          open={isModalOpen}
          onOk={() => {
            setIsModalOpen(false)
          }}
          onCancel={() => {
            setIsModalOpen(false)
          }}
          width={1200}
        >
          <div className="h-[600px] w-full">
            <DrawBoard
              mode="FlowChart"
              edit={edit}
              ref={flowChartRef}
            />
          </div>
        </Modal>
      </div>
    </DndProvider>
  )
}
