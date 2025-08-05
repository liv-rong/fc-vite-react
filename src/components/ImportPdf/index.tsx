import React, { useRef } from 'react'
import { Button } from 'antd'
import * as fabric from 'fabric'
import * as pdfjsLib from 'pdfjs-dist'
import worker from 'pdfjs-dist/build/pdf.worker.min?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = worker

// // 设置 worker 路径（重要！）
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
// // PDF base64 数据前缀
const Base64Prefix = 'data:application/pdf;base64,'

/**
 * 将 Blob 对象读取为 DataURL
 * @param {Blob} blob - 要读取的文件对象
 * @returns {Promise<string>} 返回 DataURL
 */
function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result as string))
    reader.addEventListener('error', reject)
    reader.readAsDataURL(blob)
  })
}

/**
 * 渲染 PDF 到 Canvas
 * @param {Blob | string} pdfData - PDF数据（Blob或Base64字符串）
 * @param {number[]} [pages] - 要渲染的页码数组（可选）
 * @returns {Promise<HTMLCanvasElement[]>} 返回渲染好的Canvas数组
 */
async function printPDF(pdfData: Blob | string, pages?: number[]): Promise<HTMLCanvasElement[]> {
  // 如果是Blob对象，先转换为DataURL
  pdfData = pdfData instanceof Blob ? await readBlob(pdfData) : pdfData

  // 去除Base64前缀并解码
  const data = pdfData.startsWith(Base64Prefix)
    ? atob(pdfData.substring(Base64Prefix.length))
    : pdfData

  // 加载PDF文档
  const loadingTask = pdfjsLib.getDocument({ data })

  const pdf = await loadingTask.promise
  const numPages = pdf.numPages

  // 为每一页创建渲染任务
  const renderTasks = new Array(numPages).fill(0).map(async (_, i) => {
    const pageNumber = i + 1

    // 如果指定了要渲染的页面且当前页不在其中，则跳过
    if (pages && !pages.includes(pageNumber)) {
      return null
    }

    const page = await pdf.getPage(pageNumber)

    // 设置视口（考虑设备像素比）
    const viewport = page.getViewport({ scale: window.devicePixelRatio })

    // 创建Canvas元素
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Failed to get canvas context')

    canvas.height = viewport.height
    canvas.width = viewport.width

    // 渲染PDF页面到Canvas
    const renderContext = {
      canvas: canvas,
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise
    return canvas
  })

  // 过滤掉跳过的页面
  return (await Promise.all(renderTasks)).filter(Boolean) as HTMLCanvasElement[]
}

/**
 * 将PDF转换为Fabric.js图像并添加到画布
 * @param {Blob | string} pdfData - PDF数据
 * @param {fabric.Canvas} canvas - Fabric画布实例
 * @returns {Promise<void>}
 */
async function pdfToImage(pdfData: Blob | string, canvas: fabric.Canvas): Promise<void> {
  // 计算缩放比例（考虑设备像素比）
  const scale = 1 / window.devicePixelRatio

  // 渲染PDF
  const canvases = await printPDF(pdfData)
  console.log('渲染得到的Canvas数组:', canvases)

  // 将每个Canvas转换为Fabric Image并添加到画布
  for (const c of canvases) {
    try {
      // 使用新的fabric.Image.fromURL方法

      const img = new fabric.FabricImage(await c, {
        scaleX: scale,
        scaleY: scale
      })
      console.log('转换得到的Fabric Image:', img)
      canvas.add(img)
      canvas.renderAll()
    } catch (error) {
      console.error('转换Canvas为Fabric Image失败:', error)
    }
  }
}
interface Props {
  canvas: fabric.Canvas | null
}

const ImportPdf = ({ canvas }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 处理PDF文件上传
   * @param {React.ChangeEvent<HTMLInputElement>} e - 文件输入事件
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return

    try {
      // 清空画布
      canvas.clear()

      // 添加加载中提示
      const loadingText = new fabric.Text('正在加载PDF...', {
        fontSize: 20,
        originX: 'center',
        originY: 'center',
        left: 400,
        top: 300
      })
      canvas.add(loadingText)
      canvas.renderAll()

      // 转换并添加PDF到画布
      await pdfToImage(file, canvas)
      loadingText.text = '加载完整'

      // 自动调整视图
      canvas.renderAll()
    } catch (error) {
      console.error('PDF加载失败:', error)

      // 显示错误信息
      if (canvas) {
        canvas.clear()
        const errorText = new fabric.Text('PDF加载失败', {
          fontSize: 20,
          fill: 'red',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 300
        })
        canvas.add(errorText)
      }
    } finally {
      // 重置文件输入，允许重复选择同一文件
      if (e.target) e.target.value = ''
    }
  }

  /**
   * 触发文件选择对话框
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <div>
        <Button
          type="primary"
          onClick={triggerFileInput}
        >
          导入PDF
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default ImportPdf
