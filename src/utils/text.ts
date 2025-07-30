import * as fabric from 'fabric'

export class TextUtils {
  /**
   * 将canvas上的所有对象的text属性转换为转换为可编辑的IText对象
   * @param canvas: fabric.Canvas
   * @returns
   */
  static textToItext(canvas: fabric.Canvas) {
    //将canvas上的所有对象的text属性转换为转换为可编辑的IText对象
    const textObjects = canvas.getObjects('text')
    console.log(textObjects, 'textObjects')
    textObjects.forEach((target) => {
      console.log(target instanceof fabric.FabricText)
      if (target instanceof fabric.FabricText) {
        console.log(target.text, 'target-text')
        // 创建新的 IText 对象
        const iText = new fabric.IText('我是添加文本', {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          angle: target.angle,
          originX: target.originX,
          originY: target.originY,
          skewX: target.skewX,
          skewY: target.skewY,
          flipX: target.flipX,
          flipY: target.flipY,

          // 样式属性

          fill: target.fill,
          stroke: target.stroke,
          strokeWidth: target.strokeWidth,

          // 其他重要属性
          padding: target.padding,

          opacity: target.opacity,
          shadow: target.shadow ? new fabric.Shadow(target.shadow.toString()) : null,
          visible: target.visible,
          selectable: true,
          evented: true,
          type: 'i-text',
          editable: true,
          splitByGrapheme: true
        })
        // 替换原对象
        canvas.remove(target)
        canvas.add(iText)
      }
    })
    canvas.requestRenderAll()
  }

  static text2IText(target: fabric.FabricText, canvas: fabric.Canvas) {
    const newText = new fabric.Textbox(target.text, {
      // 位置和变换属性
      left: target.left,
      top: target.top,
      width: target.width,
      height: target.height,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      angle: target.angle,
      originX: target.originX,
      originY: target.originY,
      skewX: target.skewX,
      skewY: target.skewY,
      flipX: target.flipX,
      flipY: target.flipY,
      // 样式属性
      fontFamily: target.fontFamily,
      fontSize: target.fontSize,
      fontWeight: target.fontWeight,
      fontStyle: target.fontStyle,
      underline: target.underline,
      linethrough: target.linethrough,
      overline: target.overline,
      textAlign: target.textAlign,
      textBackgroundColor: target.textBackgroundColor,
      fill: target.fill,
      stroke: target.stroke,
      strokeWidth: target.strokeWidth,
      // 其他重要属性
      padding: target.padding,
      lineHeight: target.lineHeight,
      charSpacing: target.charSpacing,
      opacity: target.opacity,
      shadow: target.shadow ? new fabric.Shadow(target.shadow.toString()) : null,
      visible: target.visible,
      selectable: true,
      evented: true
    })

    newText.on('editing:exited', () => {
      this.exitTextEdit(newText, canvas)
    })
    return newText
  }

  static exitTextEdit = (text: fabric.Textbox, canvas: fabric.Canvas) => {
    const textValue = text.text?.trim()
    if (!textValue) {
      canvas.remove(text)
    }
  }
}
