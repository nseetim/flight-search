const airports = {
  'São Paulo': [{
    name: 'Congonhas',
    city: 'São Paulo',
    airportCode: 'CGH'
  }, {
    name: 'Guarulhos',
    city: 'São Paulo',
    airportCode: 'GRU'
  }],
  Chicago: [{
    name: "O'Hare International Airport",
    city: 'Chicago',
    airportCode: 'ORD'
  }, {
    name: 'Chicago Midway International Airport',
    city: 'Chicago',
    airportCode: 'MDW'
  }]
};

const airlines = [{
  code: 1,
  name: 'American Airlines'
}, {
  code: 2,
  name: 'Frontier Airlines'
}];

const flights = {
  1: {
    '9999-01-01': {
      'ORD-CGH': [
        { key: 1, price: 100 },
        { key: 2, price: 200 },
      ],
      'ORD-GRU': [
        { key: 3, price: 100 }
      ],
      'MDW-CGH': [
        { key: 4, price: 150 }
      ],
      'MDW-GRU': [
        { key: 5, price: 150 }
      ]
    },
    '9999-01-02': {
      'ORD-CGH': [
        { key: 6, price: 100 },
      ],
      'MDW-GRU': [
        { key: 7, price: 150 }
      ]
    },
    '9998-01-01': {
      'MDW-CGH': [
        { key: 8, price: 150 },
        { key: 9, price: 150 }
      ],
    }
  },
  2: {
    '9999-01-01': {
      'ORD-CGH': [
        { key: 10, price: 200 },
      ],
      'MDW-CGH': [
        { key: 11, price: 200 }
      ]
    },
    '9999-01-02': {
      'ORD-CGH': [
        { key: 12, price: 100 },
      ]
    },
    '9998-01-01': {
      'ORD-GRU': [
        { key: 13, price: 150 },
      ]
    }
  }
};

module.exports = {
  airports,
  airlines,
  flights
};
