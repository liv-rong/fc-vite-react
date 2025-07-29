import { Button } from 'antd'
import * as fabric from 'fabric'
import { BrowserUtils } from '../../utils/browser'

interface Props {
  canvas: fabric.Canvas | null
}

const ExportSvg = ({ canvas }: Props) => {
  const handleSvg = () => {
    if (!canvas) return
    const svgData = canvas.toSVG()
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    BrowserUtils.downloadFile(url, 'image.svg')
  }

  return (
    <Button
      type="primary"
      onClick={handleSvg}
    >
      导出SVG
    </Button>
  )
}

export default ExportSvg
