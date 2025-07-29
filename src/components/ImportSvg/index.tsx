import { Button, message, Upload, type UploadProps } from 'antd'
import * as fabric from 'fabric'
import { TextUtils } from '../../utils/text'
import { useState } from 'react'

interface Props {
  canvas: fabric.Canvas | null
}

const ImportSvg = ({ canvas }: Props) => {
  const [loading, setLoading] = useState(false)

  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: 'image/svg+xml',
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        const svgString = event.target?.result as string
        handleSvg(svgString)
      }
      return false
    }
  }

  const handleSvg = (svgString: string) => {
    if (!canvas) return
    if (!loading) return
    setLoading(true)

    // 清空当前选择
    canvas.discardActiveObject()

    // 使用正确的参数顺序调用
    fabric
      .loadSVGFromString(svgString)
      .then((result) => {
        // 过滤掉 null 元素
        const objects = result.objects.filter((obj) => obj !== null) as fabric.Object[]

        if (objects.length === 0) {
          message.error('SVG解析错误: 未找到有效元素')
          return
        }
        objects.forEach((obj) => {
          console.log('obj', obj, obj.type)
          if (obj.type === 'text') {
            const iText = TextUtils.text2IText(obj as fabric.FabricText)
            canvas.add(iText)
          } else {
            canvas.add(obj)
          }
        })
        canvas.requestRenderAll()
        message.success('SVG导入成功')
      })
      .catch((error) => {
        message.error('SVG解析错误:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Upload {...props}>
      <Button type="primary">导入SVG</Button>
    </Upload>
  )
}

export default ImportSvg
