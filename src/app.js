import * as covid from "./estimator.js"

let documentData = document.getElementById('covid-form');
 documentData.addEventListener('submit', function(event) {
     event.preventDefault()
     covid.default('svhsadj')
 });

//  var person = {
//     firstName: "John",
//     lastName: "Doe",
//     age: 50,
//     eyeColor: "blue"
//   };
