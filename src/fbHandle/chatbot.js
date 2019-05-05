var mongoose = require("mongoose");
var { LIMIT } = require("config/index");
var { sendListInfo } = require("services/fbwebhookprocess");
module.exports = {
  showProducts: async (senderId, page = 0) => {
    return new Promise(async (resolve, reject) => {
      try {
        let products = await mongoose
          .model("products")
          .find()
          .limit(LIMIT)
          .skip(page * LIMIT);
        let listInfoElements = [];
        await Promise.all(
          products.map(item => {
            listInfoElements.push({
              title: `${_.get(item, "title")} - Giá ${_.get(item, "price")}`,
              subtitle: _.get(item, "description"),
              image_url: _.get(item, "cover"),
              buttons: [
                {
                  title: "Mua ngay",
                  type: "postback",
                  payload: `#dangkyhoatdong-${item.id}`,
                },
              ],
            });
          })
        );
        buttons = [
          {
            title: "Xem thêm",
            type: "postback",
            payload: `#sanpham-${page + 1}`,
          },
        ];
        await sendListInfo(senderId, listInfoElements, buttons, true);
        resolve("Đã gửi")
      } catch (err) {
        reject(err);
      }
    });
  },
};
