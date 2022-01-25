import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const cache = {};
const availableLanguages = ['en', 'fr'];
availableLanguages.forEach((lang) => cache[lang] = {});

function importAll(r) {
    r.keys().forEach((key) => {
        const [_, nested, __, lang, ___] = key.split('.').at(-2).split('/');
        cache[lang][nested] = r(key);
    })
}


importAll(require.context('components', true, /^(?!components).*\.json$/));
console.log(cache)

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        ...cache.en
    },
    fr: {
        ...cache.fr
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "fr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    }
);

export default i18n;