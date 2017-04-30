const airports = [{
  name: 'Congonhas',
  city: 'São Paulo'
}];

const airlines = [{
  code: 1,
  name: 'American Airlines'
}, {
  code: 2,
  name: 'TAM'
}];

const flights = {
  1: {
    '2017-01-01': [
      { key: 1, price: 100 },
      { key: 2, price: 200 },
    ],
    '2017-01-02': [
      { key: 3, price: 50 }
    ],
    '2016-01-01': [
      { key: 4, price: 200 }
    ]
  },
  2: {
    '2017-01-01': [
      { key: 5, price: 100 }
    ],
    '2017-01-02': [
      { key: 6, price: 200 },
      { key: 7, price: 50 }
    ],
    '2016-01-01': [
      { key: 8, price: 200 }
    ]
  }
};

module.exports = {
  airports,
  airlines,
  flights
};
