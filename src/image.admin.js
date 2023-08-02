// const AdminBro = require('admin-bro');
// const { HeaderImage } = require('../models/models');

// const { after: uploadAfterHook, before: uploadBeforeHook } = require('./actions/upload-image.hook');

// /** @type {AdminBro.ResourceOptions} */
// const options = {
//   properties: {
//     img: {
//       isVisible: false,
//     },
//     uploadImage: {
//       components: {
//         edit: AdminBro.bundle('./components/upload-image.edit.jsx'),
//       },
//     },
//   },
//   actions: {
//     new: {
//       after: async (response, request, context) => {
//         return uploadAfterHook(response, request, context);
//       },
//       before: async (request, context) => {
//         return uploadBeforeHook(request, context);
//       },
//     },
//     edit: {
//       after: async (response, request, context) => {
//         return uploadAfterHook(response, request, context);
//       },
//       before: async (request, context) => {
//         return uploadBeforeHook(request, context);
//       },
//     },
//     show: {
//       isVisible: false,
//     },
//   },
// };

// module.exports = {
//   options,
//   resource: HeaderImage,
// };
