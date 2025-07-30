export class ImgUtils {
  static svgToPng = (svgData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // 解析选项参数
        const width = 800
        const height = 600
        const backgroundColor = '#ffffff'

        // 创建Canvas元素
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(false)

        // 设置背景颜色
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // 创建SVG Blob
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        // 创建Image对象
        const img = new Image()
        img.crossOrigin = 'Anonymous'

        img.onload = () => {
          try {
            // 在Canvas上绘制SVG
            ctx.drawImage(img, 0, 0, width, height)

            // 转换为PNG Data URL
            const pngDataUrl = canvas.toDataURL('image/png')

            // 清理资源
            URL.revokeObjectURL(url)

            // 返回结果
            resolve(pngDataUrl)
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('无法加载SVG图像'))
        }

        img.src = url
      } catch (error) {
        reject(error)
      }
    })
  }

  // svg转为png
  static svgTPng(svg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const pngDataUrl = canvas.toDataURL('image/png')
          resolve(pngDataUrl)
        } else {
          reject(new Error('Canvas context is null'))
        }
        URL.revokeObjectURL(url)
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load SVG'))
      }

      img.src = url
    })
  }
}
