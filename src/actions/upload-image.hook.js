const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const AdminBro = require('admin-bro');
const express = require('express');
const app = express();

// /** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
  const { record, img } = context;
  if (record.isValid() && img) {
    // const fileName = uuid.v4() + '.png';
    // const imgPath = path.resolve(__dirname, '..', '..', 'static', fileName);
    // await fs.promises.rename(img.path, imgPath);

    const imgName = uuid.v4() + '.png';
    const filePath = path.join('static', imgName);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.rename(img.path, filePath);

    // const fileName = uuid.v4() + '.png';
    // img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));

    response.record.params.img = imgName;
    await record.update({ img: imgName });
  }
  return response;
};

// /** @type {AdminBro.Before} */
const before = async (request, context) => {
  if (request.method === 'post') {
    const { img, ...otherParams } = request.payload;

    context.img = img;
    return {
      ...request,
      payload: otherParams,
    };
  }
  return request;
};

module.exports = { after, before };
