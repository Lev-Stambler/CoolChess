const elems = document.getElementsByClassName('piece')
console.log(elems)
let moveDropped = false

let playerMove = 'p1'

for (const piece of elems) {
  console.log(piece)
  piece.addEventListener('dragstart', dragstart)
  piece.addEventListener('dragover', dragover)
  piece.addEventListener('dragenter', dragenter)
  piece.addEventListener('drop', (event) => {
    drop(piece.getAttribute('index'), event, piece, piece.getAttribute('class').indexOf('p1') !== -1 ? 'p1' : 'p2')
  })
}

const grids = document.getElementsByTagName('td')
for (const td of grids) {
  td.addEventListener('dragover', dragover)
  td.addEventListener('drop', (event) => {
    dropTD(null, event, td, 'p1')
  })
}

function dragstart(event) {

}

function dragover(event) {
  event.preventDefault()
}

function dragenter(event) {

}
let pMoves = false

function dropTD(info, event, elem, player) {
  if (moveDropped === false) {
    playerMove = playerMove === 'p2' ? 'p1' : 'p2'
    moveDropped = false
  } else {
    moveDropped = false
    if (pMoves === false) {
      playerMove = playerMove === 'p1' ? 'p1' : 'p1'
      pMoves = true
    }
  }
  const oppPlayer = playerMove === 'p2' ? 'p1' : 'p2'
  console.log('oppPlayer', oppPlayer)
  event.preventDefault()
  var data = event.dataTransfer.getData('text')
  console.log(elem)

  let appender
  if (data.indexOf('rook') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.rook`))
  } else if (data.indexOf('pawn') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.pawn`))
  } else if (data.indexOf('king') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.king`))
  } else if (data.indexOf('diagonal') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.diagonal`))
  }
  console.log(appender.parentElement.getAttribute('class'))

  let appenderParentNumb = parseInt(appender.parentElement.getAttribute('class') ||
    appender.parentElement.getAttribute('class')[0], 16)
  console.log("appenderParentNumb", appenderParentNumb)

  let hoverParentNumb = parseInt(elem.getAttribute('class') ||
    elem.getAttribute('class')[0], 16)

  console.log("hoverParentNumb", hoverParentNumb)

  if (!isLegalMove(appender.getAttribute('index'), {
      x: (appenderParentNumb - 1) % 3,
      y: parseInt((appenderParentNumb - 1) / 3)
    }, {
      x: (hoverParentNumb - 1) % 3,
      y: parseInt((hoverParentNumb - 1) / 3)
    }, {
      pawnMult: oppPlayer === 'p2' ? -1 : 1
    }) && appenderParentNumb !== 15) {
    alert('Hey, hey, hYEYYE. Illegal move')
    return false
  }
  try {
    const td = document.createElement('td')
    td.classList.add('f')
    if (elem.innerHTML.length > 2) {
      elem.children[0].classList.remove(player)
      elem.children[0].classList.add(oppPlayer)
      td.innerHTML = elem.innerHTML
      const posClass = oppPlayer !== 'p1' ? 'player1Pos' : 'player2Pos'
      console.log(posClass)
      document.querySelector(`.${posClass} table tr`).append(td)
    }
  } catch (e) {

  }
  elem.innerHTML = appender.outerHTML

  // elem.appendChild(appender)
  elem.removeEventListener('drop', () => {})

  elem.addEventListener('drop', (event) => {
    drop(appender.getAttribute('index'), event, appender, appender.getAttribute('class').indexOf('p1') !== -1 ? 'p1' : 'p2')
  })
  appender.remove()
}

function drop(info, event, elem, player) {
  const oppPlayer = playerMove === 'p2' ? 'p1' : 'p2'
  console.log('oppPlayer', oppPlayer)
  event.preventDefault()
  var data = event.dataTransfer.getData('text')
  console.log(elem)
  let appender
  if (data.indexOf('rook') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.rook`))
  } else if (data.indexOf('pawn') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.pawn`))
  } else if (data.indexOf('king') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.king`))
  } else if (data.indexOf('diagonal') !== -1) {
    appender = (document.querySelector(`.${oppPlayer}.diagonal`))
  }
  let appenderParentNumb = parseInt(appender.parentElement.getAttribute('class') || appender.parentElement.getAttribute('class')[0], 16)

  let hoverParentNumb = parseInt(elem.parentElement.getAttribute('class') ||
    elem.parentElement.getAttribute('class')[0], 16)

  if (!isLegalMove(appender.getAttribute('index'), {
      x: (appenderParentNumb - 1) % 3,
      y: parseInt((appenderParentNumb - 1) / 3)
    }, {
      x: (hoverParentNumb - 1) % 3,
      y: parseInt((hoverParentNumb - 1) / 3)
    }, {
      pawnMult: oppPlayer === 'p2' ? -1 : 1
    }) && appenderParentNumb !== 15) {
    alert('ILLEGAL MOVe')
    return false
  }
  playerMove = oppPlayer
  moveDropped = true

  const td = document.createElement('td')
  td.classList.add('f')
  elem.classList.remove(player)
  elem.classList.add(oppPlayer)
  td.innerHTML = elem.outerHTML
  const posClass = oppPlayer !== 'p1' ? 'player1Pos' : 'player2Pos'
  console.log(posClass)

  document.querySelector(`.${posClass} table tr`).append(td)
  elem.outerHTML = appender.outerHTML
  // elem.appendChild(appender)
  elem.removeEventListener('drop', () => {
    elem.addEventListener('drop', (event) => {
      drop(appender.getAttribute('index'), event, appender, appender.getAttribute('class').indexOf('p1') !== -1 ? 'p1' : 'p2')
    })
  })
  appender.remove()
}

function isLegalMove(pieceIndex, currPos, futurePos, options) {
  if (parseInt(pieceIndex) == 0) { //diaganol
    return Math.abs(currPos.x - futurePos.x) === 1 && Math.abs(currPos.y - futurePos.y) === 1
  } else if (parseInt(pieceIndex) == 1) { //king
    return Math.abs(currPos.x - futurePos.x) <= 1 && Math.abs(currPos.y - futurePos.y) <= 1 &&
      !(Math.abs(currPos.x - futurePos.x) === 0 && Math.abs(currPos.y - futurePos.y) === 0)
  } else if (parseInt(pieceIndex) === 2) { //rook
    return (Math.abs(currPos.x - futurePos.x) === 1 || Math.abs(currPos.y - futurePos.y) === 1) &&
      (Math.abs(currPos.x - futurePos.x) === 0 || Math.abs(currPos.y - futurePos.y) === 0)
  } else if (parseInt(pieceIndex) == 3) { //pawn
    return currPos.y - futurePos.y === 1 * options.pawnMult
  }
  // return true
}