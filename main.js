const buttons = document.querySelectorAll('.brand-btn')
const input = document.querySelector('input')
const info = document.querySelector('.info')
const alertBox = document.querySelector('.alertWrap')
const alertInfo = document.querySelector('.alert')

const courierCompanies = [{
    name: 'pocztex',
    firstPartOfLink: 'https://www.pocztex.pl/sledzenie-przesylek/?numer=',
    lastPartOfLink: ''
}, {
    name: 'inpost',
    firstPartOfLink: 'https://inpost.pl/sledzenie-przesylek?number=',
    lastPartOfLink: ''
}, {
    name: 'dpd',
    firstPartOfLink: 'https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=',
    lastPartOfLink: ''
}, {
    name: 'dhl',
    firstPartOfLink: 'https://www.dhl.com/pl-pl/home/tracking/tracking-parcel.html?submit=1&tracking-id=',
    lastPartOfLink: ''
}, {
    name: 'raben',
    firstPartOfLink: 'https://oftc.myraben.com/link/ShipmentInformation?ShipmentNumber=',
    lastPartOfLink: '&Language=PL'
}, {
    name: 'gls',
    firstPartOfLink: 'https://gls-group.com/PL/pl/sledzenie-paczek?match=',
    lastPartOfLink: ''
}, {
    name: 'fedex',
    firstPartOfLink: 'https://www.fedex.com/pl-pl/online/domestic-tracking.html#/preview?packages=',
    lastPartOfLink: `&trackingKey=`
}, {
    name: 'pekaes',
    firstPartOfLink: 'https://www.pekaes.pl/pl/dla-klienta.html?ShNumber=',
    lastPartOfLink: ''
}]
const showAlert = (e) => {
    alertBox.classList.remove('hide')
    alertInfo.innerText = "Wprowadź numer przesyłki"
    setTimeout(() => {
        alertBox.classList.add('hide')
    }, 1000);
}

const getBrandName = (e) => {
    const name = e.getAttribute('id')
    return name
}
const getPartsOfLink = (name) => courierCompanies.map(el => {
    for (const key in el) {
        if (el[key] === name) {
            return firstPartOfLink = el.firstPartOfLink, lastPartOfLink = el.lastPartOfLink
        }
    }
})

const makelink = (firstPartOfLink, lastPartOfLink) => {
    const TrackingNumber = input.value.replace(/\s/g, '')
    if (TrackingNumber === '') {
        showAlert()
        return false
    }
    const newLink = firstPartOfLink + TrackingNumber + lastPartOfLink
    return newLink
}

const copyNewLink = (e) => {
    getPartsOfLink(getBrandName(e.target))
    const newLink = makelink(firstPartOfLink, lastPartOfLink)
    if (newLink === false) {
        return
    }
    navigator.clipboard.writeText(makelink(firstPartOfLink, lastPartOfLink))
    info.innerHTML = `<p><b>Skopiowałeś do schowka poniższy link do trackingu </b></p><p><a href="${newLink}" target="_blank">${newLink}</a>
    </p> `
    //     setTimeout(() => {
    //  window.open(newLink, "_blank");        
    //     }, 1);

    info.classList.remove('hide')

}

buttons.forEach(el => {
    el.addEventListener('click', copyNewLink)
})