import I18n from 'i18n-2';
// Grab prefered lang from database
const i18n = new I18n({
  locales: ['en', 'fr']
  // Set it as default
  // defaultLocale: 'fr'
});
export default i18n;
