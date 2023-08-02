import React from 'react';
import { Box, Label, DropZoneItem, DropZone } from '@admin-bro/design-system';

const Edit = (props) => {
  const { property, onChange, record } = props;

  const handleDropZoneChange = (files) => {
    onChange(property.name, files[0]);
  };

  const uploadedPhoto = record.params.img;
  const photoToUpload = record.params[property.name];

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange} />
      {uploadedPhoto && !photoToUpload && <DropZoneItem src={uploadedPhoto} />}
    </Box>
  );
};

export default Edit;
