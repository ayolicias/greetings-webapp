
module.exports = function (greetServices) {

  async function home(req,res){
    try{
      let counter = await greetServices.count()
      res.render('home',{counter});
    } catch(err){}
  }

    async function getAllUsers (req, res){
        try{
                let users = await greetServices.allData()
                let database = users
                 
                res.render('greeted',{database});
              }
              catch(err){
              // console.log(er.stack)
              }
 }  

 async function getRoute(req, res) {
   try{
    let name = req.params.name;
    let language = req.params.language;
  
  
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
   }
  catch(err){}
};

async function greetUser(req, res) {
  try{
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
  }
  catch(err){}
};

   async function reset (req, res) {
      await greetServices.clear();
     
      res.redirect('/');
    };

    async function namesgreeted(req, res){
      try{
        let people = req.params.username;
        
        let result = await greetServices.findUser(people);
        let coun = result[0].counter;
       
         
      res.render('names',{people,coun});
      }
      catch(err){
      res.send(err.stack)
    }
  }


return{
    getAllUsers,
    greetUser,
    reset,
    getRoute,
    home,
    namesgreeted
}
    
}