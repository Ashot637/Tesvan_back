const express = require('express');
const app = express();
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('@admin-bro/sequelize');
const {
  Device,
  Brand,
  Categorie,
  DeviceInfo,
  ContactMessage,
  Orders,
  HeaderImage,
  SliderImage,
} = require('../models/models');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const AdminBro = require('admin-bro');
AdminBro.registerAdapter(AdminBroSequelize);

const {
  after: uploadAfterHook,
  before: uploadBeforeHook,
} = require('../src/actions/upload-image.hook');

const adminBro = new AdminBro({
  resources: [
    Device,
    {
      resource: DeviceInfo,
      options: {
        parent: {
          name: 'Devices',
        },
      },
    },
    {
      resource: HeaderImage,
      options: {
        properties: {
          img: {
            components: {
              edit: AdminBro.bundle('../src/components/upload-image.edit.jsx'),
              // list: AdminBro.bundle('./components/upload-image.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            after: async (response, request, context) => {
              return uploadAfterHook(response, request, context);
            },
            before: async (request, context) => {
              return uploadBeforeHook(request, context);
            },
          },
          edit: {
            after: async (response, request, context) => {
              return uploadAfterHook(response, request, context);
            },
            before: async (request, context) => {
              return uploadBeforeHook(request, context);
            },
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: Brand,
      options: {
        properties: {
          img: {
            components: {
              edit: AdminBro.bundle('../src/components/upload-image.edit.jsx'),
            },
          },
        },
        actions: {
          new: {
            after: async (response, request, context) => {
              return uploadAfterHook(response, request, context);
            },
            before: async (request, context) => {
              return uploadBeforeHook(request, context);
            },
          },
          edit: {
            after: async (response, request, context) => {
              return uploadAfterHook(response, request, context);
            },
            before: async (request, context) => {
              return uploadBeforeHook(request, context);
            },
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: Categorie,
      options: {
        properties: {
          img: {
            components: {
              edit: AdminBro.bundle('../src/components/upload-image.edit.jsx'),
            },
          },
        },
        actions: {
          new: {
            // after: async (response, request, context) => {
            //   return uploadAfterHook(response, request, context);
            // },
            // before: async (request, context) => {
            //   return uploadBeforeHook(request, context);
            // },
            after: uploadAfterHook,
            before: uploadBeforeHook,
          },
          edit: {
            // after: async (response, request, context) => {
            //   return uploadAfterHook(response, request, context);
            // },
            // before: async (request, context) => {
            //   return uploadBeforeHook(request, context);
            // },
            after: uploadAfterHook,
            before: uploadBeforeHook,
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
    ContactMessage,
    Orders,
    SliderImage,
    // imageUpload,
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Tesvan',
    softwareBrothers: false,
  },
});

/** @type {AdminBro.ResourceOptions} */
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASS,
  authenticate: async (email, password) => {
    const user = email === 'Admin@gmail.com';
    if (user && password === 'admin123') {
      return {
        id: 1,
        email,
        password,
      };
    }
    return null;
  },
});

module.exports = {
  adminBro,
  router,
};
