const body = {
    name: 'Isaiah',
    date: '04-12-2005',
    favCar: 'Mercedez benz',
    crush: 'Charity'
}
localStorage.setItem('testObj', body)

const obj = localStorage.getItem('testObj')
const myName = obj?.['name']

console.log(myName)
localStorage.removeItem('testObj')