import style from '../sass/style.scss';

/* 
* Page module, to be instantiated only once
*/
const page = (function(){
    let pageData = {};
    const id = 'ab932471-75e4-49ed-8716-f7a375b31845';
    const url = '/api/' + id;
    const baseClass = '.js-data-';

    /* 
    * The list of nodes to be filled
    * Used for mapping css classes to data object properties
    * Example: .js-data-address -> pageData.Adres
    */
    const textNodes = {
      address: {
        class: 'address',
        prop: 'Adres'
      },
      postcode: {
        class: 'postcode',
        prop: 'Postcode'
      },
      price: {
        class: 'price',
        prop: 'KoopPrijs'
      },
      year: {
        class: 'year',
        prop: 'Bouwjaar'
      },
      size: {
        class: 'size',
        prop: 'WoonOppervlakte'
      },
      rooms: {
        class: 'rooms',
        prop: 'AantalKamers'
      },
      since: {
        class: 'since',
        prop: 'AangebodenSindsTekst'
      },
      energy: {
        class: 'energy',
        prop: 'Energielabel.Label'
      }
    };

    /*
    * init() sets the pageData by the api response 
    */
    const init = async function () {
      try {
        const pageData = await fetchData();
        generatePage(pageData);
      } catch (error) {
        const errorMessage = `${error}. Please check your secret key (.env file) or object id`
        generateError(errorMessage);
        throw new Error(errorMessage);
      }
    }
    
    /*
    * fetchData() does the call to the api
    * and returns a promise
    * Note: Preferred fetch() to try it, not focused on browser support
    */
    const fetchData = function(){
      return fetch(url)
      .then(resp => resp.json());
    }

    /*
    * generatePage() calls the functions
    * that create the page sections
    * @param {Object} data The page data
    */
    const generatePage = function(data) {
      const funcs = [
        createTextNodes,
        createObjectImage,
        createObjectMap
      ]
      funcs.forEach((f) => f(data));
    }

    /*
    * createTextNodes() fills the text node values
    * @param {Object} data The page data
    */
    const createTextNodes = function(data) {
      Object.keys(textNodes).forEach((item) => {
        selectEl(textNodes[item].class).innerHTML = resolve(textNodes[item].prop, data);
      })
    }

    /*
    * createObjectImage() generates the html for object main image
    * @param {Object} data The page data
    */
    const createObjectImage = function(data) {
      const imgSrc = data.HoofdFoto.replace('\/', '/');
      const node = `<img class="object-media__main-image" alt="" src="${imgSrc}"></img>`
      selectEl('image').innerHTML = node;
    }

    /*
    * createObjectMap() generates the html for object map
    * @param {Object} data The page data
    */
    const createObjectMap = function(data) {
      const lat = data.WGS84_Y;
      const lon = data.WGS84_X;
      const node = `<iframe class="map-container" src="https://maps.google.com/maps?q=${lat},${lon}&hl=es;z=14&amp;output=embed"></iframe>`
      selectEl('map').innerHTML = node;
    }

   /*
    * generateError() generates the html error messgae
    * @param {String} message Error message
    */
    const generateError = function(message) {
      document.getElementById('overlay').classList.add("is-active");
      selectEl('error').innerHTML = message;
    }
    /*
    * createObjectMap() is a helper for selecting
    * @param {String} elName The element class to concatenate with base class
    */
    const selectEl = function (elName) {
      return document.querySelector(baseClass + elName);
    }

    /*
    * createObjectMap() is a helper for resolving value when a property name is given
    * @param {String} path property name such as 'Adres' or nested ones 'Energielabel.Label'
    * @param {Object} obj The data object
    * @param {String} seperator 
    */
    const resolve = function (path, obj=self, separator='.') {
      var properties = Array.isArray(path) ? path : path.split(separator)
      return properties.reduce(function(acc, curr) {
        return acc && acc[curr]}, obj);
    }

    // Let only init function to be called from page module
    return {
      init: init
    }
  })()
  
  page.init();