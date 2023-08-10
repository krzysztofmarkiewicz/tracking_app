const btnsBrnads = document.querySelectorAll('.brandBtn')
const btnsBrnadsWrap = document.querySelector('.buttons')
const inteligentBtn = document.querySelector('.inteligentBtn')
const input = document.querySelector('input')
const info = document.querySelector('.info')
const alertBox = document.querySelector('.alert')
const alertInfo = document.querySelector('.alert__info')
const closeBtns = document.querySelectorAll('.closeBtn')

const courierCompanies = [{
    name: 'pocztex',
    firstPartOfLink: 'https://www.pocztex.pl/sledzenie-przesylek/?numer=',
    lastPartOfLink: '',
    shipmentNoTemplates: [/^[A-Za-z]{2}[\d]{10}/gm]
}, {
    name: 'inpost',
    firstPartOfLink: 'https://inpost.pl/sledzenie-przesylek?number=',
    lastPartOfLink: '',
    shipmentNoTemplates: [/^[\d]{24}$/gm]
}, {
    name: 'dpd',
    firstPartOfLink: 'https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=',
    lastPartOfLink: '',
    shipmentNoTemplates: [/^[\d]{13}[A-Za-z]/gm, /^[\d]{14}$/gm]
}, {
    name: 'dhl',
    firstPartOfLink: 'https://www.dhl.com/pl-pl/home/tracking/tracking-parcel.html?submit=1&tracking-id=',
    lastPartOfLink: '',
    shipmentNoTemplates: [/^[2]{1}[\d]{10}$/gm]
}, {
    name: 'raben',
    firstPartOfLink: 'https://oftc.myraben.com/link/ShipmentInformation?ShipmentNumber=',
    lastPartOfLink: '&Language=PL',
    shipmentNoTemplates: [/^[\d]{15}$/gm]
}, {
    name: 'gls',
    firstPartOfLink: 'https://gls-group.com/PL/pl/sledzenie-paczek?match=',
    lastPartOfLink: '',
    shipmentNoTemplates: [/^[5]{1}[\d]{10}$/gm]
}, {
    name: 'fedex',
    firstPartOfLink: 'https://www.fedex.com/pl-pl/online/domestic-tracking.html#/preview?packages=',
    lastPartOfLink: `&trackingKey=`,
    shipmentNoTemplates: [/^[\d]{12}$/gm]
}, {
    name: 'ups',
    firstPartOfLink: 'https://www.ups.com/track?tracknum=',
    lastPartOfLink: '&loc=pl_PL&requester=ST/trackdetails',
    shipmentNoTemplates: [/^[1][Z-z]/]
}]

const showAlert = (e, time) => {
    alertBox.classList.remove('hide')
    alertInfo.innerText = e
    setTimeout(() => {
        alertBox.classList.add('hide')
    }, time);
}

const closeElement = (e) => {
    e.target.parentElement.classList.add('hide')
    location.reload()
}
const openLink = (link) => {
    if (autoOpenLink === 'autoOpenLinkOn') {
        setTimeout(() => {
            window.open(link, "_blank");
        }, 1);
    }
}

//set view
switch (operatingMode) {
    case 'standard':
        btnsBrnadsWrap.classList.remove('hide')
        input.classList.remove('hide')
        break;
    case 'withoutInput':
        btnsBrnadsWrap.classList.remove('hide')
        break;
    case 'intelligent':
        btnsBrnads.forEach(el => {
            el.classList.add('hide')
            el.classList.remove('brandBtn--rotate')
        })
        btnsBrnadsWrap.classList.remove('hide')
        inteligentBtn.classList.remove('hide')
        break;
    default:
}


const getTrackingNumber = () => {
    return new Promise((res, rej) => {
        if (operatingMode === 'standard') {
            let text = '';
            try {
                text = input.value.replace(/\s/g, '')
            } catch (err) {
                console.error(err);
            }
            if (text === '') {
                showAlert("Wprowadź numer przesyłki", 1000)
                return
            }
            if (text) {
                res(text)
            }
        } else if (operatingMode === 'intelligent' || operatingMode === 'withoutInput') {
            let text = '';
            try {
                text = navigator.clipboard.readText();
            } catch (err) {
                console.error('Could not read from clipboard', err);
            }
            if (text) {
                res(text)
            }

        }
    })
}


const getBrandName = (trackingNumber, e, nameBrand) => {
    if (operatingMode === 'standard' || operatingMode === 'withoutInput') {
        nameBrand.push(e.target.getAttribute('id'))
    } else if (operatingMode === 'intelligent') {
        courierCompanies.map(el => {
            for (const elem of el.shipmentNoTemplates) {
                const regex = new RegExp(elem)
                if (regex.test(trackingNumber)) {
                    nameBrand.push(el.name)
                }
            }
        })
    }
}

const showBrandButtons = (nameBrand) => {
    if (operatingMode === 'intelligent') {
        btnsBrnads.forEach(el => {
            el.classList.add('hide')
        })
        if (nameBrand.length > 0) {
            for (const elem of nameBrand) {
                btnsBrnads.forEach(el => {
                    if (el.getAttribute('id') === elem) {
                        el.classList.remove('hide')
                    }
                })
            }
        } else {
            showAlert("błędny numer lub nie potrafię go zidentyfikować", 2000);
            return
        }
    }
}


const dataValidation = (nameBrand, trackingNumber) => {
    if ((nameBrand.length > 1 && operatingMode === 'intelligent')) {
        info.innerHTML = `<p><b>Wykryłem, że numer pasuje do większej ilości firm kurierskich</b></p><p>Dowiedz się jakiej firmy jest numer tej przesyłki, przejdź do ustawień  i użyj trybu standardowego lub trybu "bez wyszukiwarki"</a></p>`
        info.classList.remove('hide')
        return false
    }
    if (trackingNumber.match(/https/gm)) {
        showAlert('błędny numer', 1000)
        return false
    }
}

const makelink = (trackingNumber, e) => {
    let nameBrand = []
    let firstPartOfLink
    let lastPartOfLink

    getBrandName(trackingNumber, e, nameBrand)
    showBrandButtons(nameBrand)

    // getPartsOfLink
    for (const elem of nameBrand) {
        courierCompanies.map(el => {
            if (elem === el.name) {
                firstPartOfLink = el.firstPartOfLink
                lastPartOfLink = el.lastPartOfLink
            }
        })
    }

    if ((dataValidation(nameBrand, trackingNumber) === false)) {
        info.classList.add('hide')
        return
    } else {
        //makes link
        const newLink = firstPartOfLink + trackingNumber + lastPartOfLink

        //copy newLink to clipboard
        navigator.clipboard.writeText(newLink)

        //show info
        info.innerHTML = `<p><b>Skopiowałeś do schowka poniższy link do trackingu </b></p><p><a href="${newLink}" target="_blank">${newLink}</a>
        </p> `
        info.classList.remove('hide')

        //opens the link automatically
        openLink(newLink)
    }
}



//listeners
btnsBrnads.forEach(el => {
    el.addEventListener('click', (e) => {
        if (operatingMode === 'standard' || operatingMode === 'withoutInput') {
            getTrackingNumber().then((res) => makelink(res, e))
        }
    })
})

inteligentBtn.addEventListener('click', () => {
    getTrackingNumber().then((res) => makelink(res))
})

closeBtns.forEach(el => {
    el.addEventListener('click', closeElement)
})