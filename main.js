const buttons = document.querySelectorAll('button')
const input = document.querySelector('input')
const info = document.querySelector('.info')
const deliveryNames = [{
    name: 'pocztex',
    firstPart: 'https://www.pocztex.pl/sledzenie-przesylek/?numer=',
    lastPart: ''
}, {
    name: 'inpost',
    firstPart: 'https://inpost.pl/sledzenie-przesylek?number=',
    lastPart: ''
}, {
    name: 'dpd',
    firstPart: 'https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=',
    lastPart: ''
}, {
    name: 'dhl',
    firstPart: 'https://www.dhl.com/pl-pl/home/tracking/tracking-parcel.html?submit=1&tracking-id=',
    lastPart: ''
}, {
    name: 'raben',
    firstPart: 'https://oftc.myraben.com/link/ShipmentInformation?ShipmentNumber=',
    lastPart: '&Language=PL'
}, {
    name: 'gls',
    firstPart: 'https://gls-group.com/PL/pl/sledzenie-paczek?match=',
    lastPart: ''
}, {
    name: 'fedex',
    firstPart: 'https://www.fedex.com/pl-pl/online/domestic-tracking.html#/preview?packages=',
    lastPart: `&trackingKey=`
}, {
    name: 'pekaes',
    firstPart: 'https://www.pekaes.pl/pl/dla-klienta.html?ShNumber=',
    lastPart: ''
}]

const getName = (e) => {
    const name = e.getAttribute('id')
    return name
}
const getPartsOfLink = (name) => deliveryNames.map(el => {
    for (const key in el) {
        if (el[key] === name) {
            return firstPart = el.firstPart, lastPart = el.lastPart
        }
    }
})

const makelink = (firstPart, lastPart) => {
    const number = input.value.replace(/\s/g, '')
    if (number === '') {
        input.innerHTML = `<p>Wprowadź numer przesyłki</p> `
        alert('Wprowadź numer przesyłki')
        return false
    }
    const newLink = firstPart + number + lastPart
    return newLink
}

const copyNewLink = (e) => {
    getPartsOfLink(getName(e.target))
    const newLink = makelink(firstPart, lastPart)
    if (newLink === false) {
        return
    }
    navigator.clipboard.writeText(makelink(firstPart, lastPart))
    info.innerHTML = `<p><b>Skopiowałeś do schowka link do trackingu </b></p><p><a href="${newLink}" target="_blank">${newLink}</a>
    </p> `
    //     setTimeout(() => {
    //  window.open(newLink, "_blank");        
    //     }, 1);

    info.classList.remove('hide')

}

buttons.forEach(el => {
    el.addEventListener('click', copyNewLink)
})