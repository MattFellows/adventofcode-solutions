const { log } = require('console');
var fs = require('fs');
var path = require('path');

const bufferFile = (relPath) => {
    return fs.readFileSync(path.join(__dirname, relPath)); // zzzz....
}

const processDay4PartOne = (lines) => {
   return lines.toString().split("\n").map((line) => {
        const gameId = line.match(/Card (.*):/)[1]
        const pickedNums = line.match(/Card .*:([ 0-9]+)\|/)[1].split(" ").filter(a => a !== '')
        const actualNums = line.match(/Card .*:[ 0-9]+\|([ 0-9]+)/)[1].split(" ").filter(a => a !== '')
        const matchedNums = pickedNums.filter(n => actualNums.indexOf(n) > -1)
        //console.log(gameId, pickedNums, actualNums)
        if (matchedNums.length <= 0) {
            return 0;
        }        
        return Math.pow(2, matchedNums.length - 1)
    }).reduce((sum,cur) => sum+cur, 0)
}

const getCardAt = (id, allCards) => {
    return allCards.filter(c => c.gameId == id)?.[0]
}

const processDay4PartTwo = (lines) => {
    const allCards = []
    const stackOfCards = []
    const processedCards = []
    lines.toString().split("\n").forEach((line) => {
         const gameId = line.match(/Card (.*):/)[1]
         const pickedNums = line.match(/Card .*:([ 0-9]+)\|/)[1].split(" ").filter(a => a !== '')
         const actualNums = line.match(/Card .*:[ 0-9]+\|([ 0-9]+)/)[1].split(" ").filter(a => a !== '')
         const matchedNums = pickedNums.filter(n => actualNums.indexOf(n) > -1)
         allCards.push({gameId, pickedNums, actualNums, matchedNums})
     })

     stackOfCards.push(...allCards)
     
     while (stackOfCards.length > 0) {
        const tempStack = []
        while (stackOfCards.length > 0) {
            const card = stackOfCards.shift()
            if (card) {
                //console.log('Processing: ', card.gameId, card.matchedNums.length)
                const cardGameId = parseInt(card.gameId, 10)
                const numberOfExtraCards = card.matchedNums.length
                if (numberOfExtraCards > 0) {
                    //console.log(`Add to stack (${stackOfCards.length}): `, cardGameId+1, 'to', cardGameId+numberOfExtraCards)
                    for (let i = cardGameId+1; i <= cardGameId+numberOfExtraCards; i++) {
                        const newCard = getCardAt(i, allCards);
                        if (newCard) {
                            //console.log('Adding to stack: ', newCard.gameId)
                            tempStack.push(newCard)
                        }
                    }
                }
                processedCards.push(card);
            }
        }
        console.log(`Adding ${tempStack.length} card to stack`)
        tempStack.forEach(c => stackOfCards.push(c))
    }

     return processedCards.length
 }

 const processDay4PartTwoFast = (lines) => {
    const allCards = []
    const stackOfCards = new Map()
    const processedCards = []
    lines.toString().split("\n").forEach((line) => {
         const gameId = line.match(/Card (.*):/)[1]
         const pickedNums = line.match(/Card .*:([ 0-9]+)\|/)[1].split(" ").filter(a => a !== '')
         const actualNums = line.match(/Card .*:[ 0-9]+\|([ 0-9]+)/)[1].split(" ").filter(a => a !== '')
         const matchedNums = pickedNums.filter(n => actualNums.indexOf(n) > -1)
         allCards.push({gameId, pickedNums, actualNums, matchedNums})
         stackOfCards.set(parseInt(gameId, 10), 1);
     })
     
     for (const card of allCards) {
        if (card) {
            //console.log('Process GameId: ' + card.gameId)
            const cardGameId = parseInt(card.gameId, 10)
            const numberOfExtraCards = card.matchedNums.length
            const copiesOfThisCard = stackOfCards.get(cardGameId)
            //console.log('There are ' + copiesOfThisCard + ' copies of this card and ' + numberOfExtraCards + ' winners')
            for (let i = cardGameId+1; i <= (cardGameId+numberOfExtraCards); i++) {
                let newId = i
                //console.log('Setting ' + newId + ' to: ' + (stackOfCards.get(newId) + copiesOfThisCard))
                stackOfCards.set(newId, parseInt(stackOfCards.get(newId) + copiesOfThisCard, 10))
            }
        }
    }

     return Array.from(stackOfCards.values()).reduce((sum,cur) => sum+cur, 0)
 }


const BUFFER = bufferFile('./input.txt');
console.log(processDay4PartTwoFast(BUFFER))