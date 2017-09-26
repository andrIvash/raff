function isMobile() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  }
  return false;
};


export function getSettings() {
  var locationUrl = document.location.href,
    appOptions;

  if (locationUrl.indexOf('school.mosreg') > -1) {
    appOptions = {
      authUrl: 'https://login.school.mosreg.ru/oauth2',
      grantUrl: 'https://api.school.mosreg.ru/v1/authorizations',
      scope: 'CommonInfo,ContactInfo,EducationalInfo,FriendsAndRelatives,Messages',
      //clientId: '8b6c6ef6c79a405fbcda77923594eccb',
      clientId: '195d1a608d1140338daec57cdeff53d0',
      
      redirectUrl: window.location.href + '/?auth=true',
      provider: 'mosreg-foxword',
      api: 'https://api.school.mosreg.ru/v1/',
      isMobile: isMobile(),
      userLink: 'https://school.mosreg.ru/user/user.aspx?user=',
      classLink: 'https://schools.school.mosreg.ru/class.aspx?class=',
      cdnPath: 'https://ad.csdnevnik.ru/special/staging/prosveshenie'
    };

   } else {

    appOptions = {
      authUrl: 'https://login.dnevnik.ru/oauth2',
      grantUrl: 'https://api.dnevnik.ru/v1/authorizations',
      scope: 'CommonInfo,ContactInfo,EducationalInfo,FriendsAndRelatives,Messages',
      clientId: '4d34a49fc2824bfcabdadda2a6381f58',
      redirectUrl: window.location.href + '?auth=true',
      provider: '1af-foxword',
      api: 'https://api.dnevnik.ru/v1/',
      isMobile: isMobile(),
      userLink: 'https://dnevnik.ru/user/user.aspx?user=',
      classLink: 'https://schools.dnevnik.ru/class.aspx?class=',
      cdnPath: 'https://ad.csdnevnik.ru/special/staging/prosveshenie'
    };
   }

  return appOptions;
}

