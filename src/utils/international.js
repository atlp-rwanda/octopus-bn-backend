import I18n from 'i18n-2';

const setLanguage = (lang) => {
  let i18n;
  if (!lang) {
    i18n = new I18n({
      locales: ['en', 'fr'],
      defaultLocale: 'en'
    });
  }
  i18n = new I18n({
    locales: ['en', 'fr'],
    defaultLocale: lang
  });

  return i18n;
};

export default setLanguage;
