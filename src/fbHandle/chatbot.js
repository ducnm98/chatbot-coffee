var mongoose = require("mongoose");
var { LIMIT } = require("config/index");
var { sendListInfo, sendText, sendImage, sendQuickReplies, sendBill } = require("services/fbwebhookprocess");
var _ = require('lodash');
var { getTime } = require('services/getTime');

module.exports = {
  intro: async (senderId) => {
    return new Promise(async (resolve, reject) => {
      await sendText(senderId, "Chào mừng bạn đã đến với quán Coffee")
      let user = await mongoose.model('customers').findOne({ facebookId: senderId })
      if (_.isEmpty(user.location)) {
        await sendText(senderId, "Hiện tại bạn chưa đăng ký địa chỉ")
        await sendText(senderId, "Để đăng ký bạn vui lòng làm theo cú pháp sau")
        await sendText(senderId, "#diachi địa chỉ nhà")
      }
      if (_.isEmpty(user.numberphone)) {
        await sendText(senderId, "Hiện tại bạn chưa đăng ký số điện thoại")
        await sendText(senderId, "Để đăng ký bạn vui lòng làm theo cú pháp sau")
        await sendText(senderId, "#sdt số điện thoại của bạn")
      }
      resolve("Đã gửi")
    }) 
  },
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
            console.log(item)
            listInfoElements.push({
              title: `${_.get(item, "title")} - Giá ${_.get(item, "price")}`,
              subtitle: _.get(item, "description"),
              image_url: _.get(item, "imageLink"),
              buttons: [
                {
                  title: "Mua ngay",
                  type: "postback",
                  payload: `#muasanpham-${item.id}`,
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
  confirmProduct: (senderId, tail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let product = await mongoose.model('products').findById(tail);
        let user = await mongoose.model('customers').findOne({ facebookId: senderId })
        let buttons = [
          {
            title: "Đồng ý",
            "content_type":"text",
            payload: `#time-${tail}`,
          },
          {
            title: "Từ chối",
            "content_type":"text",
            payload: `#disapprove-${tail}`,
          },
          {
            title: "Xem thêm",
            "content_type":"text",
            payload: `#sanpham-0`,
          },
        ];
        await sendImage(senderId, product.imageLink)
        await sendQuickReplies(senderId, `Bạn ${user.fullName} vui lòng xác nhận mua sản phẩm ${product.title}`,buttons)
      } catch (err) {
        reject(err);
      }
    })
  },
  approveProduct: (senderId, time, tail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await mongoose.model('customers').findOne({ facebookId: senderId })
        let product = await mongoose.model('products').findById(tail);
        let order = await mongoose.model('bills').create({
          customerId: user._id,
          productId: product._id,
          time
        })
        let data = {
          recipient_name: user.fullName,
          _id: order._id,
          location: user.location,
          cost: product.price,
        }
        let elements = [{
          title: product.title,
          subtitle: product.description,
          quantity: 1,
          price: product.price,
          currency: "VND",
          image_url: product.imageLink
        }];
        await sendBill(senderId, data, elements)
        await sendText(senderId, "Nhân viên giao hàng sẽ liên hệ với bạn sớm nhất")
      } catch (err) {

      }
    })
  },
  saveLocation: (senderId, tail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let location = tail.substring(8)
        await mongoose.model('customers').findOneAndUpdate({ facebookId: senderId }, { location: location })
        await sendText(senderId, `Hệ thống đã ghi nhận được địa chỉ của bạn là`)
        await sendText(senderId, location)
        resolve("Ghi nhận hoàn tất")
      } catch (err) {
        reject(err)
      }
    })
  },
  savePhone: (senderId, tail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let numberphone = tail.substring(5)
        await mongoose.model('customers').findOneAndUpdate({ facebookId: senderId }, { numberphone: numberphone })
        await sendText(senderId, `Hệ thống đã ghi nhận được số điện thoại của bạn là`)
        await sendText(senderId, numberphone)
        resolve("Ghi nhận hoàn tất")
      } catch (err) {
        reject(err)
      }
    })
  },
  chooseTime: (senderId, tail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let product = await mongoose.model('products').findById(tail);
        let user = await mongoose.model('customers').findOne({ facebookId: senderId });
        let times = getTime();
        let buttons = []
        times.map(item => {
          buttons.push({
            title: item,
            "content_type":"text",
            payload: `#approve-${item}-${tail}`
          })
        })
        console.log('run here', buttons)
        await sendImage(senderId, product.imageLink)
        await sendQuickReplies(senderId, `Bạn ${user.fullName} vui lòng chọn thời gian giao sản phẩm ${product.title}`,buttons)
      } catch (err) {
        reject(err);
      }
    })
  },
};

