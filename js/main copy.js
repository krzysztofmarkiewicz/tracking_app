// const wrapApp=document.querySelector('.wrapApp')
const btnsBrnads = document.querySelectorAll('.brand-btn')
const inteligentBtn = document.querySelector('.inteligentBtn')
const input = document.querySelector('input')
const info = document.querySelector('.info')
const alertBox = document.querySelector('.alert')
const alertInfo = document.querySelector('.alert__info')

const closeBtns = document.querySelectorAll('.closeBtn')

let trackingNumber
let nameBrand

const courierCompanies = [{
    name: 'pocztex',
    firstPartOfLink: 'https://www.pocztex.pl/sledzenie-przesylek/?numer=',
    lastPartOfLink: '',
    shipmentNoTemplates: ''
}, {
    name: 'inpost',
    firstPartOfLink: 'https://inpost.pl/sledzenie-przesylek?number=',
    lastPartOfLink: '',
    shipmentNoTemplates: /^[\d]{24}$/gm
}, {
    name: 'dpd',
    firstPartOfLink: 'https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=',
    lastPartOfLink: '',
    shipmentNoTemplates: ''
}, {
    name: 'dhl',
    firstPartOfLink: 'https://www.dhl.com/pl-pl/home/tracking/tracking-parcel.html?submit=1&tracking-id=',
    lastPartOfLink: '',
    shipmentNoTemplates: ''
}, {
    name: 'raben',
    firstPartOfLink: 'https://oftc.myraben.com/link/ShipmentInformation?ShipmentNumber=',
    lastPartOfLink: '&Language=PL',
    shipmentNoTemplates: ''
}, {
    name: 'gls',
    firstPartOfLink: 'https://gls-group.com/PL/pl/sledzenie-paczek?match=',
    lastPartOfLink: '',
    shipmentNoTemplates: ''
}, {
    name: 'fedex',
    firstPartOfLink: 'https://www.fedex.com/pl-pl/online/domestic-tracking.html#/preview?packages=',
    lastPartOfLink: `&trackingKey=`,
    shipmentNoTemplates: ''
}, {
    name: 'pekaes',
    firstPartOfLink: 'https://www.pekaes.pl/pl/dla-klienta.html?ShNumber=',
    lastPartOfLink: '',
    shipmentNoTemplates: ''
}]
const showAlert = (e) => {
    alertBox.classList.remove('hide')
    alertInfo.innerText = "Wprowadź numer przesyłki"
    setTimeout(() => {
        alertBox.classList.add('hide')
    }, 1000);
}


const getTrackingNumber = () => {

    if (operatingMode === 'standard') {
        trackingNumber = input.value.replace(/\s/g, '')
        if (trackingNumber === '') {
            showAlert()
            return false
        }
    } else if (operatingMode === 'intelligent' || operatingMode === 'withoutInput') {
        return new Promise((res, rej) => {
            let text = '';
            try {
                text = navigator.clipboard.readText();
            } catch (err) {
                console.error('Could not read from clipboard', err);
            }
            if (text) {
                trackingNumber = text
                console.log(trackingNumber);
                res(trackingNumber)
            }
        })
    }
}


const getBrandName = (e) => {
    if (operatingMode === 'standard') {
        nameBrand = e.getAttribute('id')
        console.log(operatingMode);
    } else if (operatingMode === 'intelligent') {
        nameBrand = checkTrackingNumber('523000013162306041781084')









        // nameBrand = 'inpost'
        console.log(operatingMode);

    }
    return nameBrand
}

const getPartsOfLink = (nameBrand) => courierCompanies.map(el => {
    for (const key in el) {
        if (el[key] === nameBrand) {
            return firstPartOfLink = el.firstPartOfLink, lastPartOfLink = el.lastPartOfLink
        }
    }
})

const makelink = (firstPartOfLink, lastPartOfLink) => {
    if (operatingMode === 'standard') {
        getTrackingNumber()
    }
    const newLink = firstPartOfLink + trackingNumber + lastPartOfLink
    return newLink
}

const copyNewLink = (e) => {
    getPartsOfLink(getBrandName(e.target))

    navigator.clipboard.writeText(makelink(firstPartOfLink, lastPartOfLink))
    const newLink = makelink(firstPartOfLink, lastPartOfLink)
    info.innerHTML = `<p><b>Skopiowałeś do schowka poniższy link do trackingu </b></p><p><a href="${newLink}" target="_blank">${newLink}</a>
        </p> `
    if (autoOpenLink === 'autoOpenLinkOn') {
        setTimeout(() => {
            window.open(newLink, "_blank");
        }, 1);
    }
    info.classList.remove('hide')
}
// trackingNumber = ''


const checkTrackingNumber = (trackingNumber) => {
    courierCompanies.map(el => {
        for (const key in el) {
            if (key === 'shipmentNoTemplates') {
                if (el[key] === '') {
                    return
                } else {
                    console.log(trackingNumber);
                    const regex = new RegExp(el[key])
                    const no = trackingNumber
                    if (regex.test(no)) {
                        console.log(el.name);

                        console.log('ok');
                        nameBrand = el.name
                    } else {
                        console.log('error');
                    }
                }
            }
        }
    })
}





const closeElement = (e) => {
    e.target.parentElement.classList.add('hide')
    location.reload()
}

switch (operatingMode) {
    case 'standard':
        inteligentBtn.classList.add('hide')
        break;
    case 'withoutInput':
        input.classList.add('hide')
        inteligentBtn.classList.add('hide')
        break;
    case 'intelligent':
        input.classList.add('hide')
        btnsBrnads.forEach(el => {
            el.classList.add('hide')
        })
        inteligentBtn.classList.remove('hide')
        break;
    default:
}
if (operatingMode === 'intelligent') {
    input.classList.add('hide')
    btnsBrnads.forEach(el => {
        el.classList.add('hide')
    })
    inteligentBtn.classList.remove('hide')
}


//listeners
btnsBrnads.forEach(el => {
    if (operatingMode === 'standard') {
        el.addEventListener('click', copyNewLink)
    } else if (operatingMode === 'withoutInput') {
        el.addEventListener('click', (e) => {
            nameBrand = e.target.getAttribute('id')
            getTrackingNumber().then((res) => trackingNumber = (res)).then(copyNewLink)
        })
    }

})


inteligentBtn.addEventListener('click', () => {
    // getTrackingNumber().then((res) => trackingNumber = (res)).then(copyNewLink)
    getTrackingNumber()
    console.log(getTrackingNumber().then(res));



})

closeBtns.forEach(el => {
    el.addEventListener('click', closeElement)
})