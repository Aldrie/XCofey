/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import { Model, ICreateModel } from '../types';

export const isOnlyObject = (value: any) => typeof value === 'object' && !Array.isArray(value);

const convertTypeName = (type: any) => {
  if (type && type.name) {
    return type.name.toLowerCase();
  }
  return type.toString().toLowerCase();
};

const mapObject = (object: any) => {
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (isOnlyObject(value)) {
      let newObject = {};
      if (value.type) {
        if (isOnlyObject(value.type)) {
          newObject = {
            ...object,
            [key]: {
              type: 'object',
              ...mapObject(value.type ? value.type : value),
            },
          };
        } else {
          newObject = {
            ...object,
            [key]: {
              ...value,
              ...generateTypeObject(value.type),
            },
          };
        }
      } else {
        newObject = {
          ...object,
          [key]: {
            type: 'object',
            ...mapObject(value.type ? value.type : value),
          },
        };
        delete object.type;
      }
      object = newObject;
    } else {
      object[key] = generateTypeObject(object[key]);
    }
  });


  return {
    type: 'object',
    properties: object,
  };
};

const generateTypeObject = (type: any) => {
  if (Array.isArray(type)) {
    return {
      type: 'array',
      items: typeof type[0] === 'object' ? mapObject(type[0]) : { type: convertTypeName(type[0]) },
    };
  }
  return {
    type: convertTypeName(type),
  };
};

const convertModel = (model: any) => {
  if (isOnlyObject(model)) {
    if (model.type) {
      if (isOnlyObject(model.type)) {
        return { ...model, ...mapObject(model.type) };
      }
      return { ...model, ...generateTypeObject(model.type) };
    }
    return mapObject(model);
  }
  return generateTypeObject(model);
};

export default function CreateModel(name: string, schema: Model): ICreateModel {
  return {
    name,
    model: convertModel(schema),
  };
}
