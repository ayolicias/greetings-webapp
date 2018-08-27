module.exports = function Greetings(storednames) {

  // var storednames = "";
  var names = storednames || {};

  var greeting = '';

  function greetingFunction(language, name) {
    if (name !== '' && language) {
      if (names[name] === undefined) {
        names[name] = 0;
        greetMe(language, name)
      }
    }
  }

  function greetMe(language, name) {
    if (language === 'English') {
      greeting = 'Hi, ' + name;
    }
    if (language === 'Afrikaans') {
      greeting = 'hallo, ' + name;
    }
    if (language === 'Isixhosa') {
      greeting = 'molo, ' + name;
    }

    //return language +', '+ name;
  }


  function getMap() {
    return names;
  }

  function getcount() {
    return Object.keys(names).length;
  }

  function getnames() {
    return names;
  }

  // if (name === ''){
  //     greetingElement.innerHTML = "Enter Name";
  //     return;
  // }
  // else{
  //   var message = greets.greetkey(greetinglanguage, name);
  //   greets.calculate(greetinglanguage, name);

  function getGreeting() {
    return greeting
  }

  function reset() {
    greeting = '',
      name = names = storednames || {};
  }

  return {
    getcount,
    getnames,
    greetingFunction,
    getMap,
    greetMe,
    getGreeting,
    reset
  }
}
