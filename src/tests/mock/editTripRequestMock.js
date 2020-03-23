import io from 'socket.io-client';
export const userCredentials ={
        email:'octopusbn@gmail.com',
        password:'password'
    };
export const updatedTripRequest = {
    type:'one way',
	fromCountry:'RW',
	fromCity:'KGL',
	toCountry:'UG',
	toCity:'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmwmmsns nmwnnwm wmmw',
	departureDate:'2020-08-11',
    accommodation:'yes',
}

export const validTripId = '2b5e4cd5-7137-48b8-86ca-52fdf7929a97';
export const notYourTripId = '2b5e4cd5-7137-48b8-86ca-17fdf7929a97';

export const invalidTripType = {
	type: 'somethingWrong',
	fromCountry: 'rw',
	fromCity: 'Kigali',
	toCountry: 'UG',
	toCity: 'Kampala',
	departureDate: '2020-07-17',
	accommodation: 'yes',
	reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
  };
  export const stopsMustBeProvided = {
		type:'multi city',
		fromCountry:'RW',
		fromCity:'KGL',
		toCountry:'UG',
		toCity:'Kampala',
		reason:'Let me edit you! mmsns nmwnnwm wmmw',
		departureDate:'2020-07-17',
		accommodation:'yes',
		stops: ""
  };
  export const tripWithInvalidCountry = {
	type:'multi city',
	fromCountry:'RWM',
	fromCity:'KGL',
	toCountry:'UG',
	toCity:'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'yes',
	stops: []
};
export const invalidFromCity = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 5,
	toCountry:'UG',
	toCity:'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'yes',
	stops: []
};
export const invalidToCountry = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry: 7,
	toCity:'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'yes',
	stops: []
};
export const invalidToCity = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 0,
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'yes',
	stops: []
};
export const invalidAccommodationVote = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'nope!',
	stops: []
};
export const invalidDeparture = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-01-17',
	accommodation:'no',
	stops: []
};
export const returnDateNotAllowed = {
	type:'multi city',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'no',
	returnDate:'2020-08-28',
	stops: []
};
export const invalidReturnDate = {
	type:'return',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 'Kampala',
	reason:'Let me edit you! mmsns nmwnnwm wmmw',
	departureDate:'2020-07-17',
	accommodation:'no',
	returnDate:'2020-01-28'
};
export const reasonWithFewChars = {
	type:'return',
	fromCountry:'RW',
	fromCity: 'Kigali',
	toCountry:'UG',
	toCity: 'Kampala',
	reason:'Let me edit',
	departureDate:'2020-07-17',
	accommodation:'no',
	returnDate:'2020-08-28'
};
const socketURL = 'http://localhost:3000';   
const options = {
  transports: ['websocket'],
  'force new connection': true
};
export const client = io.connect(socketURL, options);
