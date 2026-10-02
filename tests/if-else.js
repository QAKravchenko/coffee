console.log('Start');

const age = 20;

// Менше 18 -	Вхід заборонено
//if (age < 18) {
//  console.log('Forbidden');
//}

if (age < 14) {
 console.log('Без батьків не пустимо')
}

//  Від 18 включно до 21 невключно	- Вхід дозволено, алкоголь не продають
if (age >= 18 && age < 21) {
  console.log('You can go, but you cant order alcohol');
}

// Від 21 включно	- Вхід і замовлення дозволені
if (age >= 21) {
  console.log('You can go and you can order alcohol');
}

console.log('End');