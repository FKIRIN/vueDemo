const productList = [
  {"id": 1, "title": 'IPad', "price": 3000, "inventory": 2},
  {"id": 2, "title": 'IPhone', "price": 8000, "inventory": 4},
  {"id": 3, "title": 'Mac', "price": 16000, "inventory": 3},
  {"id": 4, "title": 'Airpods', "price": 1200, "inventory": 10}
]

export default {
  getProducts (cb) {
    setTimeout(() => cb(productList), 100)
  }
}