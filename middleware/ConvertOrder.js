
module.exports = function removeAccents(data) {
  console.log(data)
  if (data) {
    var newArr = [];
    for (let j = 0; j < data.cart.length; j++) {
      let secondArr = {
        cart: data.cart[j],
        condition: data.condition,
        email: data.email,
        name: data.name,
        note: data.note,
        payByCash: data.payByCash,
        phone: data.phone,
        address: data.address,
        userId : data.userId
      }
      newArr.push(secondArr)
    }

    return newArr;
  }
}