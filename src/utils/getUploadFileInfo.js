export default async function getUploadFileInfo(file) {
  const url = URL.createObjectURL(file.raw);
  // that.$forceUpdate();
  const fileSize = Math.floor((file.size / (1024 * 1024)) * 100) / 100;
  /* 转base64 */
  let reader = new FileReader();
  reader.readAsDataURL(file.raw);
  let base = {};
  reader.onload = () => {
    base.base64String = reader.result.replace(/^data:image\/\w+;base64,/, "");
  };
  const { name: fileName } = file;
  const fileExt = fileName.substring(
    fileName.lastIndexOf(".") + 1,
    fileName.length
  );
  return {
    fileSize,
    base,
    fileName,
    fileExt,
    url,
  };
}
