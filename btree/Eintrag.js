class Eintrag {
  constructor(schluesselwert, satz) {
    this.schluesselwert = schluesselwert;
    this.satz = satz;
  }

  getSatz() {
    return this.satz;
  }

  getSchluesselwert() {
    return this.schluesselwert;
  }
}

module.exports = Eintrag;
