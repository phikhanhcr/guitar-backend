const testModule = require('./function')
let server;
const request = require('supertest');

describe("first test", () => {
  it("Should return 3 ", () => {
    const res = testModule.sum(2, 3);
    expect(res).toBe(5);
  })
})


describe("/api/sanpham", () => {
  beforeEach(() => { server = require('../index') })
  afterEach(() => { server.close() })

  describe("Test server", () => {
    it("Should return status 200", async () => {
      const res = await request(server).get('/api/sanpham');
      expect(res.status).toBe(200);
    })
  })
})