export function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.onload = function(e) {
      return resolve(e.target.result)
    }
    reader.onerror = function(e) {
      reject(e)
    }
    reader.readAsDataURL(file)
  })
}

export function convertUrlToBase64(url) {
  return new Promise(function(resolve, reject) {
    var img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = url
    img.onload = function() {
      var canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src
      .substring(img.src.lastIndexOf(".") + 1)
      .toLowerCase()
      var dataURL = canvas.toDataURL("image/" + ext)
      resolve(dataURL)
    }
    img.onerror = function (e) {
      reject(e)
    }
  })
}
/**
 * @description: base64转化为流
 * @param {*} base64
 * @return {*}
 * @author: syx
 */
export function convertBase64UrlToBlob(base64) {
  var parts = base64.split(";base64,")
  var contentType = parts[0].split(":")[1]
  var raw = window.atob(parts[1])
  var rawLength = raw.length
  var uInt8Array = new Uint8Array(rawLength)
  for (var i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

/**
 * @description: 浏览器判断
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function myBrowser() {
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  if (userAgent.indexOf("OPR") > -1) {
    return "Opera"
  } //判断是否Opera浏览器 OPR/43.0.2442.991
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF"
  } //判断是否Firefox浏览器  Firefox/51.0
  if (userAgent.indexOf("Trident") > -1) {
    return "IE"
  } //判断是否IE浏览器 Trident/7.0 rv:11.0
  if (userAgent.indexOf("Edge") > -1) {
    return "Edge"
  } //判断是否Edge浏览器 Edge/14.14393
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome"
  } // Chrome/56.0.2924.87
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari"
  } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
}

/**
 * @description: 下载base64的图片
 * @param {*} base64Data
 * @param {*} name
 * @return {*}
 * @author: syx
 */
export function downloadByBase64(base64Data, name) {
  var blob = convertBase64UrlToBlob(base64Data) // 转为blob对象
  // 下载
  if (myBrowser() == "IE") {
    window.navigator.msSaveBlob(blob, name)
  } else if (myBrowser() == "FF") {
    window.location.href = base64Data
  } else {
    var a = document.createElement("a")
    a.download = name
    a.href = URL.createObjectURL(blob)
    a.click()
  }
}

export async function downloadByUrl (url, name) {
  var base64Data = await convertUrlToBase64(url)
  downloadByBase64(base64Data, name)
}