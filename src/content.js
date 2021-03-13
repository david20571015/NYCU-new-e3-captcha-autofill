function getCaptchaImage(doc) {
  return doc.querySelector('#captcha-desktop');
}

function getLoginTextField(doc) {
  return doc.getElementsByName('captcha_code')[0];
}

function imageRecongizeAndFillLoginText(base64Img) {
  const ocrURL = 'https://api.ocr.space/parse/image';

  const formData = new FormData();
  formData.append('base64Image', base64Img);
  formData.append('apikey', '0969d7ef7c88957');
  formData.append('OCREngine', '2');

  const request = {method: 'POST', body: formData};

  fetch(ocrURL, request)
      .then((response) => response.json())
      .then((jsonData) => {
        console.log('jsonData:', jsonData);
        const parsedResults = jsonData['ParsedResults'][0]['ParsedText'];
        console.log('parsedResult', parsedResults);
        return parsedResults;
      })
      .then((code) => fillLoginTextField(code))
      .catch((err) => console.log('error: ', err));
}


function fillLoginTextField(code) {
  const loginTextField = getLoginTextField(document);
  loginTextField.value = code;
}

function imageUrlToBase64(url) {
  const img = new Image();

  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    base64 = canvas.toDataURL('image/png');
    imageRecongizeAndFillLoginText(base64);
  };
  img.src = url;
}

function main() {
  const captchaImage = getCaptchaImage(document);
  console.log(captchaImage.src);
  const base64 = imageUrlToBase64(captchaImage.src);
  console.log('base64: ' + base64);
}

window.addEventListener('load', main, false);
