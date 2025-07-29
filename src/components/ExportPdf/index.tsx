import { Button, message } from 'antd'
import * as fabric from 'fabric'
import { jsPDF } from 'jspdf'

interface Props {
  canvas: fabric.Canvas | null
}

const ExportPdf = ({ canvas }: Props) => {
  const handleExport = async () => {
    if (!canvas) return

    try {
      // 3. 将画布转换为高质量图片
      // const dataUrl = canvas.toDataURL({
      //   format: 'png',
      //   quality: 1.0,
      //   multiplier: 2 // 高分辨率输出
      // })

      const svgData = canvas.toSVG()
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const dataUrl = URL.createObjectURL(blob)

      // 4. 创建 PDF 文档
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // 5. 计算缩放比例（保持宽高比）
      const canvasRatio = canvas.getWidth() / canvas.getHeight()
      const pdfRatio = pdfWidth / pdfHeight

      let renderWidth, renderHeight

      if (canvasRatio > pdfRatio) {
        // 画布更宽，按宽度适配
        renderWidth = pdfWidth
        renderHeight = pdfWidth / canvasRatio
      } else {
        // 画布更高，按高度适配
        renderHeight = pdfHeight
        renderWidth = pdfHeight * canvasRatio
      }

      // 6. 居中位置计算
      const offsetX = (pdfWidth - renderWidth) / 2
      const offsetY = (pdfHeight - renderHeight) / 2

      // 7. 添加图片到 PDF
      pdf.addImage(dataUrl, 'JPEG', offsetX, offsetY, renderWidth, renderHeight)

      // 8. 添加元数据（可选）
      pdf.setProperties({
        title: 'Fabric.js 设计导出',
        creator: 'Fabric.js PDF Export'
      })

      // 9. 保存文件
      pdf.save(`design-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch {
      message.error('导出过程中发生错误，请重试')
    }
  }

  return (
    <Button
      type="primary"
      onClick={handleExport}
      style={{ margin: '0 8px' }}
    >
      导出PDF
    </Button>
  )
}

export default ExportPdf
