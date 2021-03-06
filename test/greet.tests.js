const assert = require('assert');
const service = require('../services/greets');
const pg = require("pg");
const Pool = pg.Pool;


let useSSL = false;
//let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greet_test';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});


describe('Greeted Web App database', function() {
  beforeEach(async function() {
      await pool.query('delete from users;');
    });
    it('should return 0', async function() {
      let greet = service(pool);
      let result = await greet.allData();
      console.log(result);
      assert.strictEqual(result.length, 0);
    });

it('should greet one user', async function() {
  let greet = service(pool);
  await greet.insert('ziya', 'Hi');
  let result = await greet.allData();
  assert.strictEqual(result.length, 1);
});

it('should insert greeted users', async function() {
  let greet = service(pool);
  await greet.insert('ziya', 'Hi');
  await greet.insert('lihle', 'molo');
  await greet.insert('phindi', 'halo');
  let result = await greet.allData();
  assert.strictEqual(result.length, 3);
});

it('should counts greeted users ', async function() {
  let greet = service(pool);
  await greet.insert('ziya', 'Hi');
  await greet.insert('lihle', 'molo');
  await greet.insert('phindi', 'halo');
  let result = await greet.count();
  assert.strictEqual(result, 3);
});

it('should update greeted users ', async function() {
  let greet = service(pool);
  await greet.insert('ziya', 'Hi');
  await greet.insert('phindi', 'halo');
  await greet.updateUsers('phindi', 'molo');
  let result = await greet.findUser('phindi');
  assert.strictEqual(result[0].counter, 2);
});

beforeEach(async function() {
  await pool.query('delete from users;');
  
});
after(function(){
  pool.end();
})
});
  