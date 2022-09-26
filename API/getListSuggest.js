const express = require("express");
const get_list_suggest = express.Router();
const encodeAddress = require("./encodeAddress");
const db = require("./db");

async function getSuggest2(address, price_min, price_max, type) {
  let listSuggest = [];
  const data_nha_tro = await db.collection("post").get();
  let count = 0;
  for (const doc of await data_nha_tro.docs) {
    let point = 0;
    console.log("Found sub collection with id:", doc.id);
    console.log(doc.data().roomType);

    //type room
    console.log(doc.data().roomType + "-" + type);
    let pointRoomType = Math.abs(30 - (doc.data().roomType - type) * 10);
    point += pointRoomType;
    console.log("ahihi");
    console.log("diem roomtype la", point);

    //check address
    //check district
    console.log("address_detail", doc.data().addressDetail);

    console.log(
      doc.data().addressDetail.cityCode + " cityCode " + address.cityCode
    );
    if ((await doc.data().addressDetail.cityCode) == address.cityCode) {
      if (
        (await doc.data().addressDetail.districtCode) == address.districtCode
      ) {
        if ((await doc.data().addressDetail.wardCode) == address.wardCode) {
          if ((await doc.data().addressDetail.stress) == address.stress) {
            point += 40;
            console.log("diem dia chi la 40 /40 ");
          } else point += 30;
          console.log("diem dia chi la 30/40");
        } else point += 10;
        console.log("diem dia chi la 10/40");
      } else point += -20;
    } else {
      point += -60;
      console.log("diem dia chi la -50/40");
    }
    //check price
    const price = doc.data().postMoney;
    let priceCheck = 0;
    if (price >= price_min && price <= price_max) {
      priceCheck = 30;
    } else {
      const point =
        Math.abs(price - price_max) < Math.abs(price - price_min)
          ? Math.abs(price - price_max)
          : Math.abs(price - price_min);
      if (point > 1) priceCheck = 0;
      else priceCheck = 30 - point * 30;
      console.log("diem gia tien la / 30", priceCheck);
    }

    point += priceCheck;

    console.log("tong ket point / 100", point);
    if (point >= 60) {
      count++;
      let tmp = doc.data();

      let point2 = parseFloat(point);
      await listSuggest.push({ point: point2, data: tmp });
    }
    if (count == 50) break;
  }

  await listSuggest.sort((a, b) => {
    return b.point - a.point;
  });
  return listSuggest.slice(0, 50);
}

async function getSuggest(address, price_min, price_max, type) {
  let listSuggest = [];
  const data_nha_tro = await db.collection("post2").get();
  listSuggest = await getSuggest2(address, price_min, price_max, type);
  let count = 0;
  for (const doc of await data_nha_tro.docs) {
    let point = 0;
    console.log("Found sub collection with id:", doc.id);
    console.log(doc.data().roomType);

    //type room
    console.log(doc.data().roomType + "-" + type);
    let pointRoomType = Math.abs(30 - (doc.data().roomType - type) * 10);
    point += pointRoomType;
    console.log("ahihi");
    console.log("diem roomtype la", point);

    //check address
    //check district
    console.log("address_detail", doc.data().addressDetail);

    console.log(
      doc.data().addressDetail.cityCode + " cityCode " + address.cityCode
    );
    if ((await doc.data().addressDetail.cityCode) == address.cityCode) {
      if (
        (await doc.data().addressDetail.districtCode) == address.districtCode
      ) {
        if ((await doc.data().addressDetail.wardCode) == address.wardCode) {
          if ((await doc.data().addressDetail.stress) == address.stress) {
            point += 40;
            console.log("diem dia chi la 40 /40 ");
          } else point += 30;
          console.log("diem dia chi la 30/40");
        } else point += 10;
        console.log("diem dia chi la 10/40");
      } else point += -20;
    } else {
      point += -60;
      console.log("diem dia chi la -50/40");
    }
    //check price
    const price = doc.data().postMoney;
    let priceCheck = 0;
    if (price >= price_min && price <= price_max) {
      priceCheck = 30;
    } else {
      const point =
        Math.abs(price - price_max) < Math.abs(price - price_min)
          ? Math.abs(price - price_max)
          : Math.abs(price - price_min);
      if (point > 1) priceCheck = 0;
      else priceCheck = 30 - point * 30;
      console.log("diem gia tien la / 30", priceCheck);
    }

    point += priceCheck;

    // if()
    console.log("tong ket point / 100", point);
    if (point >= 60) {
      count++;
      let tmp = doc.data();

      let point2 = parseFloat(point);
      await listSuggest.push({ point: point2, data: tmp });
    }
    // console.log(listSuggest);
    if (count == 50) break;
  }

  await listSuggest.sort((a, b) => {
    return b.point - a.point;
  });
  return listSuggest.slice(0, 50);
}

get_list_suggest.post("/initData", async (req, res) => {
  try {
    console.log(req.body);
    const listData = await getSuggest(
      req.body.addressDetail,
      req.body.priceMin,
      req.body.priceMax,
      req.body.roomType
    );

    res.json(listData);
  } catch {
    res.status(500).send("error");
  }
});

get_list_suggest.post("/initDataForSystem", async (req, res) => {
  try {
    console.log(req.body);
    const listData = await getSuggest2(
      req.body.addressDetail,
      req.body.priceMin,
      req.body.priceMax,
      req.body.roomType
    );
    console.log(listData);

    res.json(listData);
  } catch {
    res.status(500).send("error");
  }
});

module.exports = get_list_suggest;
