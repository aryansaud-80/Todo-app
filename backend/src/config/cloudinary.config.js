import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (filepath) => {
  try {
    if (!filepath) return '';
    const response =await cloudinary.uploader.upload(filepath, {
      resource_type: 'auto',
    });
    console.log('File uploaded to cloudinary, FILE SRC:', response.url);
    fs.unlinkSync(filepath);
    return response;
  } catch (error) {
    console.log('Error in cloudinaryUpload:', error.message);
    fs.unlinkSync(filepath);
    return null;
  }
};

export const cloudinaryDelete = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    console.log('File deleted from cloudinary');
    return response;
  } catch (error) {
    console.log('Error in cloudinary Error:', error.message);
    return null;
  }
};
