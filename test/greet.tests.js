const assert = require('assert');
const services = require('../services/greets');
const pg = require("pg");
const Pool = pg.Pool;


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greeted_app_database';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});


describe('The greeted database', function() {
  describe('Count the number of users added ', function() {
    beforeEach(async function() {
      await pool.query('delete from users;');
    });
    it('should return 0', async function() {
      let greet = services(pool);
      let result = await greet.allData();
      assert.strictEqual(result.length, 0);
    });

    beforeEach(async function() {
      await pool.query('delete from users;');
    });

    it('should greet one user', async function() {
      let greet = services(pool);
      await greet.insert('ziya', 'Hi');
      let result = await greet.allData();
      assert.strictEqual(result.length, 1);
    });

    beforeEach(async function() {
      await pool.query('delete from users;');
    });

    it('should insert greeted users', async function() {
      let greet = services(pool);
      await greet.insert('ziya', 'Hi');
      await greet.insert('lihle', 'molo');
      await greet.insert('phindi', 'halo');
      let result = await greet.allData();
      assert.strictEqual(result.length, 3);
    });

    it('should count users ', async function() {
      let greet = services(pool);
      await greet.insert('ziya', 'Hi');
      await greet.insert('lihle', 'molo');
      await greet.insert('phindi', 'halo');
      let result = await greet.count();
      assert.strictEqual(result, 3);
    });

    it('should return how many users ', async function() {
      let greet = services(pool);
      await greet.insert('ziya', 'Hi');
      await greet.insert('phindi', 'halo');
      let result = await greet.greetUser('phindi');
      assert.strictEqual(result.users_greeted, 'phindi');
    });

    it('should increment counter for greeted users ', async function() {
      let greet = services(pool);
      await greet.insert('ziya', 'Hi');
      await greet.insert('phindi', 'halo');
      await greet.insert('phindi', 'molo');
      let result = await greet.IncrementUser('phindi');
      assert.strictEqual(result, 2);
    });

    beforeEach(async function() {
      await pool.query('delete from users;');
    });

    after(function() {
      pool.end();
    });
  });
});
