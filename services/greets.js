module.exports = function(pool) {

  async function allData() {
    let keep = await pool.query('select * from users');
    return keep.rows;
  }
  async function insert(name, language) {
    await pool.query('insert into users (users_greeted, user_language, counter) values ($1,$2,$3)', [name, language, 1])

  }
  async function count() {
    let current = await pool.query('select count(*) from users');
    return parseInt(current.rows[0].count);
  }
  async function updateUsers(increment, name, language) {
    await pool.query('update users set counter =$1 where users_greeted =$2,user_language =$3', [increment, name, language]);

  }
  async function greetUser(name) {
    let user = await pool.query('select * from users where users_greeted = $1', [name]);
    return user.rows[0];
  }

  async function IncrementUser(name, language) {
    let user = await allData(name);

    if (user.length != 0) {
      let increment = user.counter + 1;
      await IncrementUser(name, language, increment);
    } else {
      await insert(name, language);
    }

    if (user.rows.length != 0) {
      let currentCounter = await pool.query('select counter from users where users_greeted = $1', [name]);
      let increment = currentCounter.rows[0].counter + 1;
      await pool.query('update users set counter =$1 where users_greeted =$2, where user_language =$3', [increment, name, language]);
    } else {
      await pool.query('insert into users (users_greeted, user_language, counter) values ($1,$2,$3)', [name, language, 1])

    }
  }
  async function increment(){
    let currentCounter = await pool.query('select counter from users where users_greeted = $1',[name]);
     return parseInt(currentCounter.rows[0].increment +1);
  }

  return {
    allData,
    insert,
    count,
    updateUsers,
    greetUser,
    IncrementUser,
    increment
  }
}
