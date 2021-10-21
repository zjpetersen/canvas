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

  //DataUrl: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAN9JREFUOE9jZMADNC38/4Okr5/YyIhLGU4JkGYJj0Cwvhc71uM0BKsByJphNuMyBMMAbJrxGYJigIWLFdjPnDZpWL38/cgssPiJPcfg+uAMkGbnPBGwgr2T3mAYAtKMLA8zBGwAsmaY1ciGIGtGlgcZwohNM7IiEBtmM7q/QJZQbgA+L+yotAVb6tF+GMMVINvBXoA5Cz0QYZph8siGwDSD5LBGI7pmZENwRiNMUai7y//ZZcZY00Fq11mG1Tv3oFiKNSljMwSbZgwvIFuLbAguzXgNAEmCDAHR6M5GtggAS/CDexHwwoEAAAAASUVORK5CYII=
  //Base64 0x89504e470d0a1a0a0000000d49484452000000100000001008060000001ff3ff61000000017352474200aece1ce90000009749444154388d638cce7bf89f818181e1f8a660067460e9b716ab384c8e81818181099fe6271727c315a203981e265c3610038e6f0a86b8009bed1cba720c0c0c0c785dc1c0c080dd0052008601c8b6c3003e5750d705d86c27e40aeabae0f8a660861f971f615528a39f8b35bd503f16b0b90297edb47101ba2bf0d9cec0c0c0c0842f991202967e6b212ec066c8f14dc1786d87e90100cf0141c9852e14480000000049454e44ae426082
  export const dataUrlToByteArray = (color) => {
    color = color.split(',')[1];
    let binary_string = window.atob(color);
    let len = binary_string.length;
    let bytes = new Int8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };