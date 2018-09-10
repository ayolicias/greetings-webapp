
module.exports = function (greetServices) {

    async function getAllUsers (req, res){
        try{
                let users = await greetServices.allData()
                let database = users
                 
                res.render('greeted',{database});
              }
              catch(err){
                console.log(er.stack)
              }
 }  


async function greetUser(req, res) {
  let name = req.body.inputName;
  let language = req.body.language;


  if (name === "" && language === undefined) {
    req.flash("entryOne", 'Enter name & Select Language')
  }

  else if (name ==='' || name === undefined) {
    req.flash("entryTwo", 'Enter name')
  }
  else if (language ===''|| language === undefined) {
    req.flash("entryThree", 'select language')
  }

  else{
    await greetServices.greetUser(name,language);
    req.flash("entryOne",language + ', '+name)
}
let counter = await greetServices.count()

  res.render('home',{counter});
};

   async function reset (req, res) {
      await greetServices.clear();
     
      res.redirect('/');
    };
return{
    getAllUsers,
    greetUser,
    reset
}
    
}