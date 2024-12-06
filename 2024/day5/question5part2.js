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
        if (sheaf[j] === rules[i].before) {
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

const incorrectOrderPages = pages.filter(s => {
  let correctOrder = true
  for (let i = 0; i < s.length; i++) {
    correctOrder = correctOrder && followsRules(s, i)
  }
  return !correctOrder
})


const findUnfollowedRule = (sheaf, pageNum) => {
  //console.log('Finding Unfollowed Rules', sheaf)
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].before === sheaf[pageNum]) {
      for (let j = 0; j < sheaf.length; j++) {
        if (sheaf[j] === rules[i].after) {
          if (j <= pageNum) {
            console.log(`Error because ${j} <= ${pageNum}, so ${sheaf[j]} is not right of ${rules[i].before}`)
            return {rule: rules[i], after: false, before: true, index: j}
          }
        }
      }
    }
    if (rules[i].after === sheaf[pageNum]) {
      for (let j = 0; j < sheaf.length; j++) {
        if (sheaf[j] === rules[i].before) {
          if (j > pageNum) {
            console.log(`Error because ${j} > ${pageNum}, so ${sheaf[j]} is not left of ${rules[i].after}`)
            return {rule: rules[i], after: true, before: false, index: j}
          }
        }
      }
    }
  }
}

const fixPages = (incorrectSheaf) => {
  let correctedSheaf = [...incorrectSheaf]
  for (let i = 0; i < incorrectSheaf.length; i++) {
    const unfollowedRule = findUnfollowedRule(correctedSheaf, i)
    if (unfollowedRule && unfollowedRule.before) {
      console.log('B', i, incorrectSheaf, unfollowedRule)
      if (i >= 1 && (i+2) < correctedSheaf.length) {
        //console.log(`B1 ${correctedSheaf.slice(0,i)}, ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}, ${correctedSheaf.slice(i+1, unfollowedRule.index)}, ${correctedSheaf.slice(unfollowedRule.index+1)}`)
        correctedSheaf = [...correctedSheaf.slice(0,i), correctedSheaf[unfollowedRule.index], correctedSheaf[i], ...correctedSheaf.slice(i+1, unfollowedRule.index), ...correctedSheaf.slice(unfollowedRule.index+1)]
      } else if (i >= 1) {
        //console.log(`B2 ${correctedSheaf.slice(0,i)}, ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}}`)
        correctedSheaf = [...correctedSheaf.slice(0,i), correctedSheaf[unfollowedRule.index], correctedSheaf[i]]
      } else if ((i+2) < correctedSheaf.length) {
        //console.log(`B3 ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}, ${correctedSheaf.slice(i+2)}`)
        correctedSheaf = [correctedSheaf[unfollowedRule.index], correctedSheaf[i], ...correctedSheaf.slice(i+2)]
      }
    }
    if (unfollowedRule && unfollowedRule.after) {
      console.log('A', i, incorrectSheaf, unfollowedRule)
      if (i >= 1 && (i+2) < correctedSheaf.length) {
        //console.log(`A1 ${correctedSheaf.slice(0,i)}, ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}, ${correctedSheaf.slice(i+1, unfollowedRule.index)}, ${correctedSheaf.slice(unfollowedRule.index+1)}`)
        correctedSheaf = [...correctedSheaf.slice(0,i), correctedSheaf[unfollowedRule.index], correctedSheaf[i], ...correctedSheaf.slice(i+1, unfollowedRule.index), ...correctedSheaf.slice(unfollowedRule.index+1)]
      } else if (i >= 1) {
        //console.log(`A2 ${correctedSheaf.slice(0,i)}, ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}}`)
        correctedSheaf = [...correctedSheaf.slice(0,i), correctedSheaf[unfollowedRule.index], correctedSheaf[i]]
      } else if ((i+2) < correctedSheaf.length) {
        //console.log(`A3 ${correctedSheaf[unfollowedRule.index]}, ${correctedSheaf[i]}, ${correctedSheaf.slice(i+2)}`)
        correctedSheaf = [correctedSheaf[unfollowedRule.index], correctedSheaf[i], ...correctedSheaf.slice(i+2)]
      }
      console.log('A', correctedSheaf)
      console.log('------------------------------------')
    }
  }
  return correctedSheaf
}

let copyOfIncorrectOrderPages = [...incorrectOrderPages].map(function(arr) {
  return arr.slice();
});
let cont = true
while (cont) {
  copyOfIncorrectOrderPages = copyOfIncorrectOrderPages.map(fixPages).map(function(arr) {
    return arr.slice();
  });
  const newIncorrectPages =  copyOfIncorrectOrderPages.filter(s => {
    let correctOrder = true
    for (let i = 0; i < s.length; i++) {
      correctOrder = correctOrder && followsRules(s, i)
    }
    return !correctOrder
  }).map(fixPages).map(function(arr) {
    return arr.slice();
  });
  if (newIncorrectPages.length === 0) {
    cont = false
  }
  console.log(`looping ${newIncorrectPages.length}`)
}


//console.log(rules)
//console.log(pages)

//console.log(incorrectOrderPages)

//console.log(copyOfIncorrectOrderPages)
console.log(incorrectOrderPages.reduce((p,c) => (Number(p) || 0) + Number(c.length)), copyOfIncorrectOrderPages.reduce((p,c) => (Number(p) || 0) + Number(c.length)))
console.log(copyOfIncorrectOrderPages.map(l => l[(Math.round(l.length-1)/2)]).reduce((p,c) => p+c))