import { DrawBoard, DrawBoardDndProvider } from 'ivy-fc-test1'
import type { DrawBoardRef, SidebarProps } from 'ivy-fc-test1'
import { jsonData, jsonData1 } from './data'

import { useState, useRef } from 'react'

import { Button } from 'antd'

const TestComp = () => {
  const [edit, setEdit] = useState(true)

  const flowChartRef = useRef<DrawBoardRef>(null)

  const [operateType, setOperateType] = useState<string[]>([
    'line',
    'shape',
    'text',
    'material',
    'myMaterial',
    'pencil'
  ])

  const sidebarProps: SidebarProps[] = [
    {
      key: 'draw',
      icon: <div className="text-xl text-slate-700 size-6" />,
      component: <div>asfasf</div>
    }
  ]

  const handleExportJson = () => {
    const resJson = flowChartRef.current?.exportJson()
    console.log(resJson)
  }

  const handleImportJson = () => {
    if (!flowChartRef.current) {
      return
    }
    flowChartRef.current?.importJson(JSON.stringify(jsonData1))
    setEdit(false)
  }

  const handleImportJson2 = () => {
    flowChartRef.current?.importJson(JSON.stringify(jsonData))
    setEdit(false)
  }

  const addSvg = () => {
    flowChartRef.current?.addSvg('')
  }

  return (
    <div
      className="flex h-screen w-screen min-w-[1200px] flex-col items-center justify-center gap-10 bg-white"
      style={{ color: '#000000' }}
    >
      <div className="flex gap-5">
        <Button onClick={() => setEdit(!edit)}>{edit ? '退出编辑' : '进入编辑'}</Button>
        <Button onClick={handleExportJson}>导出JSON</Button>
        <Button onClick={handleImportJson}>导入JSON1</Button>
        <Button onClick={handleImportJson2}>导入JSON2</Button>
        <Button onClick={addSvg}>导入Svg</Button>
        <Button
          onClick={() => {
            setOperateType(['line', 'shape'])
          }}
        >
          转为流程图模式
        </Button>
      </div>

      <div className="h-[800px] w-[1200px] border">
        <DrawBoardDndProvider>
          <DrawBoard
            mode={operateType}
            edit={edit}
            ref={flowChartRef}
            sidebarProps={sidebarProps}
          />
        </DrawBoardDndProvider>
      </div>
    </div>
  )
}

export default TestComp
