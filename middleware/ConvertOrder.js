module.exports = function removeAccents(data) {
  if (data) {
    var newArr = [];
    for (var i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].cart.length; j++) {
        let secondArr = {
          cart: data[i].cart[j],
          condition: data[i].condition,
          email: data[i].email,
          name: data[i].name,
          note: data[i].note,
          payByCash: data[i].payByCash,
          phone: data[i].phone,
          address: data[i].address
        }
        newArr.push(secondArr)
      }
    }
    return newArr;
  }
}