function modifyCode(code) {
  console.log('code');
  console.log(code);

  const correcting = {
    'O': 0,
    'o': 0,
    'l': 1,
    'i': 1,
    'A': 4,
  };

  for (let key of code) {
    if ( Object.keys(correcting).includes(key)) key = correctedMap[key];
  }

  if (!/\d{4}/.test(code)) throw new Error('Please reflash the page.');

  return code;
}

async function imageRecongize(base64Img) {
  const ocrURL = 'https://api.ocr.space/parse/image';

  const formData = new FormData();
  formData.append('base64Image', base64Img);
  formData.append('apikey', '0969d7ef7c88957');
  formData.append('OCREngine', '2');
  const request = {method: 'POST', body: formData};

  const fetchResult = await fetch(ocrURL, request)
      .then((res) => res.json())
      .catch((err) => err);

  console.log('fetchResult', fetchResult);

  if (fetchResult instanceof Error) throw fetchResult;

  let parsedResults = fetchResult['ParsedResults']
      .reduce((acc, val) => acc += val['ParsedText'], '');
  parsedResults = modifyCode(parsedResults);

  return parsedResults;
}

function fillLoginTextField(code) {
  const loginTextFieldList = document.getElementsByName('captcha_code');
  for (const textField of loginTextFieldList) textField.value = code;
}

function captchaImageOnLoad(img) {
  return async function() {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    base64 = canvas.toDataURL('image/png');
    console.log('base64', base64);

    try {
      const code = await imageRecongize(base64);
      fillLoginTextField(code);
    } catch (e) {
      alert(e);
    }
  };
};

function main() {
  const captchaImage = document.querySelector('#captcha-desktop');
  captchaImage.onload = captchaImageOnLoad(captchaImage);
}

window.addEventListener('load', main, false);
