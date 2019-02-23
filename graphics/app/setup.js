/* eslint-disable no-var */
var bgs
var mask
var label
var labelStyle
var maxX // eslint-disable-line no-unused-vars
/* eslint-enable no-var */

(function () {
  'use strict'

  const pixi = PIXI // eslint-disable-line no-undef
  const AppMake = pixi.Application
  const Graphics = pixi.Graphics
  const Text = pixi.Text
  const Style = pixi.TextStyle

  // Create the canvas element that will become the render target.
  // EaselJS calls this a "stage".
  const containerEl = document.getElementById('container')
  const app = new AppMake(992, 100, {
    transparent: true,
    antialias: true
  })
  const stage = app.stage
  const renderer = app.renderer
  stage.id = 'notification'
  containerEl.appendChild(app.view)

  const SLANT = 20

  // Store some important coordinates we'll be needing later.
  const midX = renderer.width / 2
  maxX = renderer.width - SLANT
  const maxY = renderer.height

  // Create the stage on the target canvas, and create a ticker that will render at 60 fps.
  // const stage = new createjs.Stage('notification')
  app.ticker.add(delta => {
    bgs.forEach(bg => {
      // The two left side x values. Will be inverted to get right side x values.
      const tipX = Math.min(-(bg.w / 2), 0)
      const baseX = Math.min(-(bg.w / 2) + SLANT, 0)

      // Start at top left point, moves clockwise
      bg.clear()
      bg.beginFill(bg.c)
      bg.moveTo(baseX, 0)
      bg.lineTo(-baseX, 0)
      bg.lineTo(-tipX, maxY / 2)
      bg.lineTo(-baseX, maxY)
      bg.lineTo(baseX, maxY)
      bg.lineTo(tipX, maxY / 2)
      bg.position.set(bg.xL, bg.y)
    })

    const tipX = Math.min(-(bg1.w / 2), 0)
    const baseX = Math.min(-(bg1.w / 2) + SLANT, 0)

    bgM.clear()
    bgM.beginFill(bg1.c)
    bgM.moveTo(baseX, 0)
    bgM.lineTo(-baseX, 0)
    bgM.lineTo(-tipX, maxY / 2)
    bgM.lineTo(-baseX, maxY)
    bgM.lineTo(baseX, maxY)
    bgM.lineTo(tipX, maxY / 2)
    bgM.position.set(bg1.xL, bg1.y)
  })

  // Create the three background elements
  const bg3 = new Graphics()
  bg3.name = 'bg3'
  bg3.xIn = 0
  bg3.w = 0
  bg3.c = 0xe87933
  bg3.xL = midX
  stage.addChild(bg3)

  const bg2 = new Graphics()
  bg2.name = 'bg2'
  bg2.xIn = 23
  bg2.w = 0
  bg2.c = 0xf6ce14
  bg2.xL = midX
  stage.addChild(bg2)

  const bg1 = new Graphics()
  bg1.name = 'bg1'
  bg1.xIn = 54
  bg1.maxWidth = maxX - bg1.xIn
  bg1.w = 0
  bg1.c = 0x6bba82
  bg1.xL = midX
  stage.addChild(bg1)

  // Create a mask that will duplicate bg1 for text masking
  const bgM = new Graphics()
  bgM.name = 'bgM'
  stage.addChild(bgM)

  // Put all the background elements into an array to make the stagger tweens a bit easier to write
  bgs = [bg1, bg2, bg3]
  mask = bgM

  // Create the text element
  labelStyle = new Style({
    fontFamily: 'proxima-nova',
    fontWeight: 800,
    fontSize: 65,
    fill: 0xF7F2E8,
    align: 'center'
  })
  label = new Text('SUBSCRIBER', labelStyle)
  label.showY = 11
  label.hideY = 0
  label.position.set(midX, label.hideY)
  label.mask = mask
  label.maxWidth = bg1.maxWidth - (SLANT * 3)
  label.anchor.set(0.5, 0)
  stage.addChild(label)
})()
