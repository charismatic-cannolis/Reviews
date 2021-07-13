const request = require('supertest');
// ('http://localhost:5555')
const server = require('../server/index.js');
// TestWatcher(
// )

afterAll(() => {
    server.pool.end();
    // server.app.close();
})

describe('/reviews', () => {
  test('should respond with a 200 status code', () => {
    request(server.app)
      .get('/reviews?product_id=4')
      .expect(200)

    //   .end(function(err, res){
    //     assert.equal(res.status, 200, "HTTP response OK");
    //     assert.isArray(res.body.data, "Should return an array");
    //     done();
    //   })
  })
  test('should respond with a 404 status code', () => {
    request(server.app)
      .get('/reviews?product_id=4&page=11&count=100')
      .expect(404)
  })
})

describe('/reviews/meta', () => {
    test('should respond with a 200 status code', () => {
      request(server.app)
        .get('/reviews?product_id=4&page=11&count=100')
        .expect(200)
    })
  })