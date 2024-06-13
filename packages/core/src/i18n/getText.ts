import getText from "gettext.js"
import de_DE from '@/src/i18n/po/Beremiz_de_DE.po'
import fr_FR from "@/src/i18n/po/Beremiz_fr_FR.po"

const locales = {
    de_DE,
    fr_FR
}

// https://github.com/guillaumepotier/gettext.js/issues/37
//@ts-expect-error
const get = new getText()

get.loadJSON(de_DE)
get.loadJSON(fr_FR)

export default get as typeof get & { setLocale: (locale: keyof typeof locales) => void }
