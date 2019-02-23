(function () {
  'use strict'

  const pixi = PIXI // eslint-disable-line no-undef
  const Style = pixi.TextStyle

  // Permanent GSAP timeline
  const tl = new TimelineLite({ autoRemoveChildren: true })
  const label = window.label
  const bgs = window.bgs
  const maxX = window.maxX

  // Dope constants.
  const DELAY_INCREMENT = 0.09
  const SUB_COLORS = [
    0xe87933,
    0xf6ce14,
    0x6bba82
  ]
  const TIP_COLORS = [
    0x6bba82,
    0xe87933,
    0xf6ce14
  ]
  const FIRST_MSG_STYLE = new Style({
    fontFamily: 'proxima-nova',
    fontWeight: 800,
    fontSize: 65,
    fill: 0xF7F2E8,
    align: 'center'
  })
  const SECOND_MSG_STYLE = new Style({
    fontFamily: 'proxima-nova',
    fontWeight: 800,
    fontSize: 65,
    fill: 0xF7F2E8,
    align: 'center'
  })

  nodecg.listenFor('twitch-subscription', 'nodecg-streamlabs', data => {
    // Got a subscription on Twitch
    let firstMsg = 'NEW SUBSCRIBER'
    if (data.months && data.months !== 1) {
      firstMsg = `RESUB × ${data.months}`
    }

    notify(firstMsg, data.name, {
      colors: SUB_COLORS,
      inSound: 'sub'
    })
  })

  nodecg.listenFor('donation', 'nodecg-streamlabs', tip => {
    // Got a donation on StreamLabs
    notify(`${tip.formatted_amount} TIP`, truncateTo25(tip.name), {
      colors: TIP_COLORS,
      inSound: 'tip'
    })
  })

  nodecg.listenFor('twitch-bits', 'nodecg-streamlabs', cheer => {
    // Got a cheer on Twitch
    notify(`${cheer.amount} BITS`, truncateTo25(cheer.name), {
      colors: TIP_COLORS,
      inSound: 'tip'
    })
  })

  nodecg.listenFor('twitch-follow', 'nodecg-streamlabs', follow => {
    // Got a follow on Twitch
    notify(`NEW FOLLOW`, follow.name, {
      colors: SUB_COLORS,
      inSound: 'sub'
    })
  })

  function notify (firstMsg, secondMsg, opts) {
    firstMsg = firstMsg.toUpperCase()
    secondMsg = secondMsg.toUpperCase()
    opts = opts || {}
    opts.colors = opts.colors || SUB_COLORS

    const reverseBgs = bgs.slice(0).reverse()
    const foremostBg = bgs[0]

    // Animate in
    tl.add('npIn')

    tl.call(() => {
      for (let i = 0; i < bgs.length; i++) {
        bgs[i].c = opts.colors[i]
      }
      nodecg.playSound(opts.inSound)
    }, null, null, 'npIn')

    tl.staggerTo(reverseBgs, 0.75, {
      w: (i, t) => {
        return maxX - t.xIn
      },
      ease: Elastic.easeOut.config(0.3, 0.4)
    }, DELAY_INCREMENT, `npIn`)

    tl.to(label, 0.6, {
      onStart () {
        label.style = FIRST_MSG_STYLE
        label.text = firstMsg
        fixWidth(label)
      },
      y: label.showY,
      ease: Back.easeOut.config(4)
    }, `npIn+=${DELAY_INCREMENT * bgs.length}`)

    // Show second message
    tl.to(foremostBg, 0.6, {
      onStart () {
        nodecg.playSound('cut')
      },
      w: 0,
      ease: Elastic.easeIn.config(0.3, 0.4),
      onComplete () {
        label.style = SECOND_MSG_STYLE
        label.text = secondMsg
        fixWidth(label)
      }
    }, '+=1.5')

    tl.to(foremostBg, 0.6, {
      w: maxX - foremostBg.xIn,
      ease: Elastic.easeOut.config(0.3, 0.4)
    }, '+=0.01')

    // Animate out
    tl.add('npOut', '+=4')

    tl.call(() => {
      nodecg.playSound('out')
    }, null, null, 'npOut')

    tl.staggerTo(bgs, 0.7, {
      w: 0,
      ease: Elastic.easeIn.config(0.3, 0.4)
    }, DELAY_INCREMENT, `npOut`)

    tl.to(label, 0.467, {
      y: label.hideY,
      ease: Power2.easeIn
    }, `npOut+=${DELAY_INCREMENT * bgs.length}`)

    // Kill time between successive notifications
    tl.to({}, 1, {})
  }

  function truncateTo25 (text) {
    const len = text.length
    if (len > 25) {
      let truncated = text.substring(0, 23)
      truncated += '…'
      return truncated
    }

    return text
  }

  function resetWidth (thing) {
    thing._width = undefined
    thing.scale.set(1)
  }

  function fixWidth (thing) {
    resetWidth(thing)
    if (thing.width > thing.maxWidth) {
      thing.width = thing.maxWidth
    }
  }
})()
