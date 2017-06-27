/**
 * @namespace faker.finance
 */
var Finance = function (faker) {
  var ibanLib = require("./iban");
  var Helpers = faker.helpers,
      self = this;

  /**
   * account
   *
   * @method faker.finance.account
   * @param {number} length
   */
  self.account = function (length) {

      length = length || 8;

      var template = '';

      for (var i = 0; i < length; i++) {
          template = template + '#';
      }
      length = null;
      return Helpers.replaceSymbolWithNumber(template);
  };

  /**
   * accountName
   *
   * @method faker.finance.accountName
   */
  self.accountName = function () {

      return [Helpers.randomize(faker.definitions.finance.account_type), 'Account'].join(' ');
  };

  /**
   * mask
   *
   * @method faker.finance.mask
   * @param {number} length
   * @param {boolean} parens
   * @param {boolean} ellipsis
   */
  self.mask = function (length, parens, ellipsis) {

      //set defaults
      length = (length == 0 || !length || typeof length == 'undefined') ? 4 : length;
      parens = (parens === null) ? true : parens;
      ellipsis = (ellipsis === null) ? true : ellipsis;

      //create a template for length
      var template = '';

      for (var i = 0; i < length; i++) {
          template = template + '#';
      }

      //prefix with ellipsis
      template = (ellipsis) ? ['...', template].join('') : template;

      template = (parens) ? ['(', template, ')'].join('') : template;

      //generate random numbers
      template = Helpers.replaceSymbolWithNumber(template);

      return template;
  };

  //min and max take in minimum and maximum amounts, dec is the decimal place you want rounded to, symbol is $, €, £, etc
  //NOTE: this returns a string representation of the value, if you want a number use parseFloat and no symbol

  /**
   * amount
   *
   * @method faker.finance.amount
   * @param {number} min
   * @param {number} max
   * @param {number} dec
   * @param {string} symbol
   *
   * @return {string}
   */
  self.amount = function (min, max, dec, symbol) {

      min = min || 0;
      max = max || 1000;
      dec = dec === undefined ? 2 : dec;
      symbol = symbol || '';
      var randValue = faker.random.number({ max: max, min: min, precision: Math.pow(10, -dec) });

      return symbol + randValue.toFixed(dec);
  };

  /**
   * transactionType
   *
   * @method faker.finance.transactionType
   */
  self.transactionType = function () {
      return Helpers.randomize(faker.definitions.finance.transaction_type);
  };

  /**
   * currencyCode
   *
   * @method faker.finance.currencyCode
   */
  self.currencyCode = function () {
      return faker.random.objectElement(faker.definitions.finance.currency)['code'];
  };

  /**
   * currencyName
   *
   * @method faker.finance.currencyName
   */
  self.currencyName = function () {
      return faker.random.objectElement(faker.definitions.finance.currency, 'key');
  };

  /**
   * currencySymbol
   *
   * @method faker.finance.currencySymbol
   */
  self.currencySymbol = function () {
      var symbol;

      while (!symbol) {
          symbol = faker.random.objectElement(faker.definitions.finance.currency)['symbol'];
      }
      return symbol;
  };

  /**
   * bitcoinAddress
   *
   * @method  faker.finance.bitcoinAddress
   */
  self.bitcoinAddress = function () {
    var addressLength = faker.random.number({ min: 27, max: 34 });

    var address = faker.random.arrayElement(['1', '3']);

    for (var i = 0; i < addressLength - 1; i++)
      address += faker.random.alphaNumeric().toUpperCase();

    return address;
  };

  /**
   * ethereumAddress
   *
   * @method  faker.finance.ethereumAddress
   */
  self.ethereumAddress = function () {
    var address = faker.random.hexaDecimal(40);

    return address;
  };

  /**
   * iban
   *
   * @method  faker.finance.iban
   */
  self.iban = function (formatted) {
      var ibanFormat = faker.random.arrayElement(ibanLib.formats);
      var s = "";
      var count = 0;
      for (var b = 0; b < ibanFormat.bban.length; b++) {
          var bban = ibanFormat.bban[b];
          var c = bban.count;
          count += bban.count;
          while (c > 0) {
              if (bban.type == "a") {
                  s += faker.random.arrayElement(ibanLib.alpha);
              } else if (bban.type == "c") {
                  if (faker.random.number(100) < 80) {
                      s += faker.random.number(9);
                  } else {
                      s += faker.random.arrayElement(ibanLib.alpha);
                  }
              } else {
                  if (c >= 3 && faker.random.number(100) < 30) {
                      if (faker.random.boolean()) {
                          s += faker.random.arrayElement(ibanLib.pattern100);
                          c -= 2;
                      } else {
                          s += faker.random.arrayElement(ibanLib.pattern10);
                          c--;
                      }
                  } else {
                      s += faker.random.number(9);
                  }
              }
              c--;
          }
          s = s.substring(0, count);
      }
      var checksum = 98 - ibanLib.mod97(ibanLib.toDigitString(s + ibanFormat.country + "00"));
      if (checksum < 10) {
          checksum = "0" + checksum;
      }
      var iban = ibanFormat.country + checksum + s;
      return formatted ? iban.match(/.{1,4}/g).join(" ") : iban;
  };

  /**
   * bic
   *
   * @method  faker.finance.bic
   */
  self.bic = function () {
      var vowels = ["A", "E", "I", "O", "U"];
      var prob = faker.random.number(100);
      return Helpers.replaceSymbols("???") +
          faker.random.arrayElement(vowels) +
          faker.random.arrayElement(ibanLib.iso3166) +
          Helpers.replaceSymbols("?") + "1" +
          (prob < 10 ?
              Helpers.replaceSymbols("?" + faker.random.arrayElement(vowels) + "?") :
          prob < 40 ?
              Helpers.replaceSymbols("###") : "");
  };

  /**
   * individual person inn
   *
   * @method  faker.finance.innfl
   */
  self.innfl = function () {
    var region = Helpers.addZeros(String(Math.floor((Math.random() * 92) + 1)),2);
		var inspection = Helpers.addZeros(String(Math.floor((Math.random() * 99) + 1)),2);
		var numba = Helpers.addZeros(String(Math.floor((Math.random() * 999999) + 1)),6);
		var rezult = region + inspection + numba;
		var kontr = String(((
				7*rezult[0] + 2*rezult[1] + 4*rezult[2] +
				10*rezult[3] + 3*rezult[4] + 5*rezult[5] +
				9*rezult[6] + 4*rezult[7] + 6*rezult[8] +
				8*rezult[9]
			) % 11) % 10);
		kontr == 10 ? kontr = 0: kontr = kontr;
		rezult = rezult + kontr;
		kontr = String(((
				3*rezult[0] +  7*rezult[1] + 2*rezult[2] +
				4*rezult[3] + 10*rezult[4] + 3*rezult[5] +
				5*rezult[6] +  9*rezult[7] + 4*rezult[8] +
				6*rezult[9] +  8*rezult[10]
			) % 11) % 10);
		kontr == 10 ? kontr = 0: kontr = kontr;
		rezult = rezult + kontr;
		return rezult;
  };

  /**
   * company inn
   *
   * @method  faker.finance.innul
   */
  self.innul = function () {
    var region = Helpers.addZeros(String(Math.floor((Math.random() * 92) + 1)),2);
		var inspection = Helpers.addZeros(String(Math.floor((Math.random() * 99) + 1)),2);
		var numba = Helpers.addZeros(String(Math.floor((Math.random() * 99999) + 1)),5);
		var rezult = region + inspection + numba;
		var kontr = String(((
				2*rezult[0] + 4*rezult[1] + 10*rezult[2] +
				3*rezult[3] + 5*rezult[4] + 9*rezult[5] +
				4*rezult[6] + 6*rezult[7] + 8*rezult[8]
			) % 11) % 10);
		kontr == 10 ? kontr = 0: kontr = kontr;
		rezult = rezult + kontr;
		return rezult;
  };

  /**
   * ogrn
   *
   * @method  faker.finance.ogrn
   */
  self.ogrn = function () {
    var priznak = String(Math.floor((Math.random() * 9) + 1));
		var godreg = Helpers.addZeros(String(Math.floor((Math.random() * 16) + 1)),2);
		var region = Helpers.addZeros(String(Math.floor((Math.random() * 92) + 1)),2);
		var inspection = Helpers.addZeros(String(Math.floor((Math.random() * 99) + 1)),2);
		var zapis = Helpers.addZeros(String(Math.floor((Math.random() * 99999) + 1)),5);
		var rezult = priznak + godreg + region + inspection + zapis;
		var kontr = String(((rezult) % 11) % 10);
		kontr == 10 ? kontr = 0: kontr = kontr;
		rezult = rezult + kontr;
		return rezult;
  };

  /**
   * kpp
   *
   * @method  faker.finance.kpp
   */
  self.kpp = function () {
    var region = Helpers.addZeros(String(Math.floor((Math.random() * 92) + 1)),2);
		var inspection = Helpers.addZeros(String(Math.floor((Math.random() * 99) + 1)),2);
		var prichina = Math.floor((Math.random() * 4) + 1);
		switch (prichina) {
			case 1:
			prichina = '01';
			break
			case 2:
			prichina = '43';
			break
			case 3:
			prichina = '44';
			break
			case 4:
			prichina = '45';
			break
			default:
			prichina = '01';
			break
		}
		var numba = Helpers.addZeros(String(Math.floor((Math.random() * 999) + 1)),3);
		var rezult = region + inspection + prichina + numba;
		return rezult;
  };

  /**
   * snils
   *
   * @method  faker.finance.snils
   */
  self.snils = function () {
    var rand1 = Helpers.addZeros(String(Math.floor((Math.random() * 998) + 2)),3);
		var rand2 = Helpers.addZeros(String(Math.floor((Math.random() * 999) + 1)),3);
		var rand3 = Helpers.addZeros(String(Math.floor((Math.random() * 999) + 1)),3);
		var rezult = rand1 + rand2 + rand3;
		var kontr = String(9*rezult[0] + 8*rezult[1] + 7*rezult[2] +
					6*rezult[3] + 5*rezult[4] + 4*rezult[5] +
					3*rezult[6] + 2*rezult[7] + 1*rezult[8]);
		if (kontr < 100) {
			kontr = kontr;
		}
		else if (kontr > 101) {
			kontr = String(kontr % 101);
			kontr = Helpers.addZeros(kontr, 2);
			if (kontr > 99) {
				kontr = '00';
			}
		}
		else {
			kontr = '00';
		}
		rezult = rezult + kontr;
		return rezult;
  };
};

module['exports'] = Finance;
