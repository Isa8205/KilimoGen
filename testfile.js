const date = new Date()
console.log(date.toISOString().slice(0,10).split('-').reverse().join('-'))