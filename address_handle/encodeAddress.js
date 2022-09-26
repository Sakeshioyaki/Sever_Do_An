const hethongphuongxa = require("./hethongphuongxa");

async function encodeAddress(address) {
  console.log("address 2222:", address);

  const cityCode = await hethongphuongxa.hethongtinhthanh[address.city.trim()];
  let tmp1 = (await cityCode) + " - " + address.district;
  const districtCode = await hethongphuongxa.dshuyenthixa[tmp1];
  if (cityCode == undefined || districtCode == undefined) return -1;
  let result = [];
  if (address.ward == "") {
    result = [
      cityCode + districtCode + wardCode,
      {
        more: address.more,
        stress: address.stress,
        ward: "",
        district: address.district,
        city: address.city,
        wardCode: "",
        districtCode: districtCode,
        cityCode: cityCode,
      },
    ];
  } else {
    const tmp2 =
      (await hethongphuongxa.dshuyenthixa[tmp1]) + " - " + address.ward;
    const wardCode = await hethongphuongxa.hethongxaphuong[tmp2];
    if (wardCode != undefined) {
      result = [
        cityCode + districtCode + wardCode,
        {
          more: address.more,
          stress: address.stress,
          ward: address.ward,
          district: address.district,
          city: address.city,
          wardCode: wardCode,
          districtCode: districtCode,
          cityCode: cityCode,
        },
      ];
      console.log(result);
    } else {
      return -1;
    }
  }
  return result;
}
module.exports = { encodeAddress };
