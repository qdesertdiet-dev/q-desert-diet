const language = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';
const englishRestaurantName = localStorage.getItem('restaurantName') || '';
const restaurantName = language === 'ar'
	? localStorage.getItem('restaurantNameAr') || englishRestaurantName
	: englishRestaurantName;
const logoUrl = localStorage.getItem('siteLogoUrl') || '';
const topbarColor = localStorage.getItem('topbarColor') || '';
const buttonColor = localStorage.getItem('buttonColor') || '';
const validColor = value=>/^#[0-9a-fA-F]{6}$/.test(value);

document.documentElement.lang = language;
document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

if(validColor(topbarColor)) document.documentElement.style.setProperty('--topbar-color',topbarColor);
if(validColor(buttonColor)) document.documentElement.style.setProperty('--button-color',buttonColor);
const savedTheme = localStorage.getItem('siteTheme');
if(['theme-teal','theme-dark','theme-pastel'].includes(savedTheme)){
	document.documentElement.classList.add(savedTheme);
}

window.initialRestaurantBranding = {restaurantName,logoUrl};
if(restaurantName) document.title = `${restaurantName} Catalog`;
