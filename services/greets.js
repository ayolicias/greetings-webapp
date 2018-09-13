module.exports = function(pool) {

  async function allData() {
    let keep = await pool.query('select * from users');
    return keep.rows;
  }
  async function insert(name, language) {
   let found = await pool.query('insert into users (users_greeted, user_language) values ($1,$2)', [name, language])
   return found;
  }
  async function count() {
    let current = await pool.query('select count(*) from users');
    return parseInt(current.rows[0].count);
  }
  async function updateUsers(name, language) {
   let update = await pool.query('update users set counter=(counter+1) , user_language=$2  where users_greeted =$1', [name, language]);
   return update;
  }
  async function findUser(name) {
    let user = await pool.query('select * from users where users_greeted = $1', [name]);  
    return user.rows;
  }

  async function greetUser(name,language){
    let user = await  findUser(name);
    if (user.length == 0) {
     await insert(name,language);
    }
     else{
      await updateUsers(name,language);
    }
  }
  async function clear () {
    let clear = await pool.query('DELETE FROM users');
     return clear.rows[0];
  }

  return {
    allData,
    insert,
    count,
    updateUsers,
    greetUser,
    clear,
    findUser 
  }
}
