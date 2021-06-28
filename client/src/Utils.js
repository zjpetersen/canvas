import {Base64} from 'js-base64';

  export const convertToDataUrl = (color) => {
    color = color.substr(2, color.length);
    let bytes = [];
    for (let c = 0; c < color.length; c += 2) {
      bytes.push(parseInt(color.substr(c, 2), 16));
    }
    let int8arr = Uint8Array.from(bytes);
    color = 'data:image/png;base64,';
    color += Base64.fromUint8Array(int8arr);
    return color;
  };