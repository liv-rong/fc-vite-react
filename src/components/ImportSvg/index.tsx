import { Button, message, Upload, type UploadProps } from 'antd'
import * as fabric from 'fabric'
import { TextUtils } from '../../utils/text'
import { useState } from 'react'

interface Props {
  canvas: fabric.Canvas | null
}

const ImportSvg = ({ canvas }: Props) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: 'image/svg+xml',
    showUploadList: false,
    beforeUpload: (file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 限制5MB
        message.warning('SVG文件过大，建议优化后再导入')
        return false
      }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        const svgString = event.target?.result as string
        handleSvg(svgString)
      }
      return false
    }
  }

  const handleSvg = async (svgString: string) => {
    if (!canvas) return
    if (loading) return

    setLoading(true)
    setProgress(0)

    try {
      // 1. 先清空画布释放内存
      canvas.clear()
      canvas.discardActiveObject()

      // 2. 使用更轻量的解析方式
      const result = await fabric.loadSVGFromString(svgString)

      const objects = result.objects.filter((obj) => obj !== null) as fabric.Object[]

      if (objects.length === 0) {
        message.error('SVG解析错误: 未找到有效元素')
        return
      }

      // 3. 创建多个小分组而不是一个大分组
      const groupSize = 50 // 每个分组包含的对象数
      const groupCount = Math.ceil(objects.length / groupSize)
      const groups: fabric.Group[] = []

      // 4. 使用requestAnimationFrame分步处理
      const processObjects = async () => {
        for (let i = 0; i < groupCount; i++) {
          const start = i * groupSize
          const end = start + groupSize
          const batch = objects.slice(start, end)

          const group = new fabric.Group([], {
            objectCaching: true,
            interactive: true,
            subTargetCheck: true,
            selectable: true // 先不可选，减少渲染压力
          })

          for (const obj of batch) {
            if (obj.type === 'text') {
              const iText = TextUtils.text2IText(obj as fabric.FabricText, canvas)
              iText.set({
                selectable: false,
                subTargetCheck: true,
                evented: false // 初始不响应事件
              })
              group.add(iText)
            } else {
              obj.set({
                selectable: false,
                subTargetCheck: true,
                evented: false // 初始不响应事件
              })
              group.add(obj)
            }
          }
          //dev/nsfc_lite

          groups.push(group)
          canvas.add(group)
          setProgress(Math.round(((i + 1) / groupCount) * 100))

          // 每处理完一个分组就释放控制权
          await new Promise((resolve) => requestAnimationFrame(resolve))
        }
        console.log(groups, 'groups')

        // 5. 最终合并分组（如果需要）
        if (groups.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          const mainGroup = new fabric.Group(groups, {
            objectCaching: true,
            subTargetCheck: true,
            interactive: true
          })
          canvas.clear()
          console.log(mainGroup, 'mainGroupgroups')
          canvas.add(mainGroup)
        }

        canvas.renderAll()
        setLoading(false)
        message.success(`SVG导入成功 (${objects.length}个对象)`)
      }

      await processObjects()
    } catch (err) {
      console.error('SVG导入错误:', err)
      message.error('SVG解析错误: ' + (err instanceof Error ? err.message : String(err)))
      setLoading(false)
    }
  }

  return (
    <Upload {...props}>
      <Button
        type="primary"
        loading={loading}
      >
        {loading ? `导入中... ${progress}%` : '导入SVG'}
      </Button>
    </Upload>
  )
}

export default ImportSvg
