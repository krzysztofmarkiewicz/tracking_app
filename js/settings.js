const wrapApp = document.querySelector('.wrapApp')
const settingsBox = document.querySelector('.settings')
const settingsBtn = document.querySelector('.settingsBtn')
const settingBtns = document.querySelectorAll('.settings__btn')

let operatingMode = ''
let autoOpenLink = ''
let darkMode = ''

const showSettings = () => {
    wrapApp.classList.add('hide')
    settingsBox.classList.remove('hide')
}

//sets settings when starting the application; retrieves values from local storage or if in local storage data not exists, sets default settings
const startApp = () => {
    const checkLocalStorage = (name, key) => {

        if (localStorage.getItem(key) === null) {
            settingBtns.forEach(el => {
                let firstOption = el.parentElement.firstElementChild
                if (el.parentElement.getAttribute('data-mode') == key) {
                    el.classList.remove('settings__btn--active')
                    firstOption.classList.add('settings__btn--active')
                    name = firstOption.getAttribute('data-mode')
                }
            })
        } else {
            name = localStorage.getItem(key)
            settingBtns.forEach(el => {
                if (el.getAttribute('data-mode') === name) {
                    el.classList.add('settings__btn--active');
                }
            });
        }

        return name
    }
    operatingMode = checkLocalStorage(operatingMode, 'operatingMode')
    autoOpenLink = checkLocalStorage(autoOpenLink, 'autoOpenLink')
    darkMode = checkLocalStorage(darkMode, 'darkMode')
}
startApp()

//supports setting buttons
const setupApp = (e) => {
    let siblings
    const clickedBtn = e.target

    if (e.target.classList.contains('settings__btn--disabled')) {
        return
    }

    const siblingsBtns = () => {
        const allBtns = Array.from(e.target.parentElement.children)
        siblings = allBtns.filter((el) => {
            return el != clickedBtn
        })
    }
    siblingsBtns()
    siblings.forEach(el => {
        el.classList.remove('settings__btn--active');
    })
    clickedBtn.classList.add('settings__btn--active')

    const setLocalStorage = (e) => {
        const key = e.target.parentElement.getAttribute('data-mode')
        const value = e.target.getAttribute('data-mode')
        localStorage.setItem(key, value)
    }
    setLocalStorage(e)

}

//listeners
settingsBtn.addEventListener('click', showSettings)

settingBtns.forEach(el => {
    el.addEventListener('click', setupApp)
});