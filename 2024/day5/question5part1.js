const fs = require('fs')
const input = fs.readFileSync('./input.txt').toString()
const lines = input.split("\n").map(l => l.trim())
const rulesPlain = lines.filter(l => l.match(/\|/))
const pagesPlain = lines.filter(l => l.match(/,/))

const rules = rulesPlain.map(l => {
  const split = l.split(/\|/)
  return {before: Number(split[0].trim()), after: Number(split[1].trim())}
})

const pages = pagesPlain.map(p => p.split(",").map(s => Number(s)))

const followsRules = (sheaf, pageNum) => {
  let correctOrder = true
  for (let i = 0; i < rules.length; i++) {
    let noneAplicable = true
    if (rules[i].before === sheaf[pageNum]) {
      //console.log(`Before Match: ${rules[i].before} ${rules[i].after} ${sheaf[pageNum]} ${pageNum}`)
      for (let j = 0; j < sheaf.length; j++) {
        if (sheaf[j] === rules[i].after) {
          correctOrder = correctOrder && j > pageNum
        }
      }
      //console.log(`Before order ${correctOrder}`)
    }
    if (rules[i].after === sheaf[pageNum]) {
      //console.log(`After Match: ${rules[i].before} ${rules[i].after} ${sheaf[pageNum]} ${pageNum}`)
      for (let j = 0; j < sheaf.length; j++) {
        if (sheaf[j] === rules[i].after) {
          //console.log(`${j} should be <= ${pageNum}`)
          correctOrder = correctOrder && j <= pageNum
        }
      }
      //console.log(`After order ${correctOrder}`)
    }
  }
  //console.log(`Returning: ${correctOrder}`)
  return correctOrder
}

const correctOrderPages = pages.filter(s => {
  let correctOrder = true
  for (let i = 0; i < s.length; i++) {
    correctOrder = correctOrder && followsRules(s, i)
  }
  return correctOrder
})

console.log(rules)
console.log(pages)
console.log(correctOrderPages)

console.log(correctOrderPages.map(l => l[(Math.round(l.length-1)/2)]).reduce((p,c) => p+c))