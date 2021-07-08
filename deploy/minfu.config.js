const configs = [
  {
    name: 'Contact',
    js: ['../js/util.js', '../js/inputs.js', '../js/requests.js'],
    css: ['../css/common.css'],
    outputDir: '../dist',
    outputJS: 'contact.js',
    outputCSS: 'contact.css'
  },
  {
    name: 'CommissionCreate',
    js: ['../js/commission.js', '../js/requests.js', '../js/util.js', '../js/inputs.js', '../js/card.js'],
    css: ['../css/common.css', '../css/commission/commission_create.css'],
    outputDir: '../dist',
    outputJS: 'commission_create.js',
    outputCSS: 'commission_create.css',
  },
  {
    name: 'CommissionIndex',
    js: ['../js/util.js', '../js/card.js', '../js/preview.js', '../js/commission.js', '../js/requests.js', '../js/inputs.js'],
    css: ['../css/common.css', '../css/commission/commission_index.css'],
    outputDir: '../dist',
    outputJS: 'commission_index.js',
    outputCSS: 'commission_index.css',
  },
  {
    name: 'ListingCreate',
    js: ['../js/util.js', '../js/card.js', '../js/preview.js', '../js/requests.js', '../js/filedrop.js', '../js/inputs.js'],
    css: ['../css/common.css'],
    outputDir: '../dist',
    outputJS: 'listing_create.js',
    outputCSS: 'listing_create.css',
  },
  {
    name: 'ListingIndex',
    js: ['../js/util.js', '../js/preview.js', '../js/requests.js', '../js/card.js'],
    css: ['../css/common.css', '../css/listing/index.css'],
    outputDir: '../dist',
    outputJS: 'listing_index.js',
    outputCSS: 'listing_index.css',
  },
  {
    name: 'FileUpload',
    js: ['../js/filedrop.js'],
    css: ['../css/file_upload.css'],
    outputDir: '../dist',
    outputJS: 'file_upload.js',
    outputCSS: 'file_upload.css',
  },
  {
    name: 'PreviewCard',
    js: ['../js/card.js'],
    css: [],
    outputDir: '../dist',
    outputJS: 'preview_card.js',
  },
  {
    name: 'ExplainCard',
    js: ['../js/card.js'],
    css: [],
    outputDir: '../dist',
    outputJS: 'explain_card.js',
  },
  {
    name: 'SideMenu',
    js: ['../js/burger.js'],
    css: [],
    outputDir: '../dist',
    outputJS: 'side_menu.js',
  },
  {
    name: 'Index',
    css: ['../css/common.css', '../css/index.css'],
    outputDir: '../dist',
    outputCSS: 'index.css'
  },
];

export default configs;