var Eintrag = require(require("path").join(__dirname, "Eintrag.js"));

class Knoten {
  constructor(ordnung, mutterknoten, unterbaeume, eintraege) {
    this.ordnung = ordnung;
    this.mutterknoten = mutterknoten; // Hilfsvariable
    this.unterbaeume = unterbaeume;
    this.eintraege = eintraege;
  }

  insert(schluesselwert, satz) {
    for(let i=0; i<this.eintraege.length; i++) {
      if(this.eintraege[i].getSchluesselwert() > schluesselwert) {
        return (this.unterbaeume.length===0) ? this._insert_eintrag(i, schluesselwert, satz) : this.unterbaeume[i].insert(schluesselwert, satz);
      } else if(this.eintraege[i].getSchluesselwert() === schluesselwert) {
        this.eintraege[i] = new Eintrag(schluesselwert, satz);
        return false;
      }
    }
    return (this.unterbaeume.length===0) ? this._insert_eintrag(this.eintraege.length, schluesselwert, satz) : this.unterbaeume[this.unterbaeume.length-1].insert(schluesselwert, satz);
  }

  delete(schluesselwert) {
    var result = this._read(schluesselwert);
    if(result === false) {
      return false;
    }

    // Blatt?
    if(result.knoten.unterbaeume.length === 0) {
        return result.knoten._delete(result.eintrag,0);
    }

    var naechstenKnoten = result.knoten.unterbaeume[result.eintrag+1];
    while(naechstenKnoten.unterbaeume.length>0) {
      naechstenKnoten = naechstenKnoten.unterbaeume[0];
    }
    result.knoten.eintraege[result.eintrag] = naechstenKnoten.eintraege[0];
    return naechstenKnoten._delete(0,0);
  }

  _finde_position(schluesselwert) {
    for(let i = 0; i<this.eintraege.length;i++) {
        if(this.eintraege[i].getSchluesselwert()>schluesselwert) {
          return i;
        }
    }
    return this.eintraege.length;
  }


  _delete(eintrag,pos) {
    this.eintraege.splice(eintrag,1);
    if(this.unterbaeume.length>0) {
      this.unterbaeume.splice(eintrag+pos,1);
    }

    if(this.eintraege.length>=this.ordnung) {
      return true;
    }

    var mitte = this.mutterknoten._finde_position(this.eintraege[0].getSchluesselwert());
    if(mitte>0) {
        let links = this.mutterknoten.unterbaeume[mitte-1];
        if(links.eintraege.length>this.ordnung) {
          let k = Math.floor((links.eintraege.length-this.ordnung)/2);
          let eintraege = links.eintraege.splice(links.eintraege.length-k,k);
          let unterbaeume = links.unterbaeume.length>0 ? links.unterbaeume.splice(this.ordnung+1,k) : [];
          let neueMitte = eintraege.shift();
          eintraege.push(this.mutterknoten.eintraege[mitte-1]);
          this.eintraege = eintraege.concat(this.eintraege);
          this.unterbaeume = unterbaeume.concat(this.unterbaeume);
          this.mutterknoten.eintraege[mitte-1] = neueMitte;
          return true;
        }
    }

    if(this.mutterknoten.unterbaeume.length>mitte+1) {
      let rechts = this.mutterknoten.unterbaeume[mitte+1];
      if(rechts.eintraege.length>this.ordnung) {
        let k = Math.floor(rechts.eintraege.length-this.ordnung/2);
        let eintraege = rechts.eintraege.splice(0,k);
        let unterbaeume = rechts.unterbaeume.length>0 ? rechts.unterbaeume.splice(0,k) : [];
        let neueMitte = eintraege.pop();
        eintraege.unshift(this.mutterknoten.eintraege[mitte-1]);
        this.eintraege = this.eintraege.concat(eintraege);
        this.unterbaeume = this.unterbaeume.concat(unterbaeume);
        this.mutterknoten.eintraege[mitte-1] = neueMitte;
        return true;
      }
    }

    if(mitte>0) {
      let links = this.mutterknoten.unterbaeume[mitte-1];
      links.eintraege.push(this.mutterknoten.eintraege[mitte]);
      links.eintraege.concat(this.eintraege);
      for(let i=0; i<this.unterbaeume.length;i++) {
          this.unterbaeume[i].mutterknoten = links;
      }
      links.unterbaeume.concat(this.unterbaeume);
      return this.mutterknoten._delete(mitte,1);
    } else {
      let rechts = this.mutterknoten.unterbaeume[mitte+1];
      this.eintraege.push(this.mutterknoten.eintraege[mitte]);
      rechts.eintraege = this.eintraege.concat(rechts.eintraege);
      for(let i=0; i<this.unterbaeume.length;i++) {
          this.unterbaeume[i].mutterknoten = rechts;
      }
      rechts.unterbaeum = this.unterbaeume.concat(rechts.unterbaeume);
      return this.mutterknoten._delete(mitte,0);
    }
  }

  _read(schluesselwert) {
    for(let i=0; i<this.eintraege.length; i++) {
      if(this.eintraege[i].getSchluesselwert() > schluesselwert) {
        return (this.unterbaeume.length===0) ? false : this.unterbaeume[i]._read(schluesselwert);
      } else if(this.eintraege[i].getSchluesselwert() === schluesselwert) {
        return { knoten : this, eintrag : i};
      }
    }
    return (this.unterbaeume.length===0) ? false : this.unterbaeume[this.unterbaeume.length-1]._read(schluesselwert);
  }

  read(schluesselwert) {
    var result = this._read(schluesselwert);
    if(result === false) {
      return false;
    }
    return result.knoten.eintraege[result.eintrag].getSatz();
  }

  _insert_eintrag(pos, schluesselwert, satz) {
      this.eintraege.splice(pos,0, new Eintrag(schluesselwert, satz));
      return this._insert_ueberlauf();
  }

  _insert_ueberlauf() {
    if(this.eintraege.length!==this.ordnung*2+1) {
      return true;
    }
    var unterbaeume = this.unterbaeume.length>0 ? this.unterbaeume.splice(this.ordnung+1,this.ordnung+1) : [];
    var eintraege = this.eintraege.splice(this.ordnung,this.ordnung+1);
    var neueMitte = eintraege.shift();
    var rechterKnoten = new Knoten(this.ordnung,this.mutterknoten,unterbaeume,eintraege);
    for(let i=0; i<unterbaeume.length;i++) {
      unterbaeume[i].mutterknoten = rechterKnoten;
    }
    if(this.mutterknoten === null) {
      this.mutterknoten = new Knoten(this.ordnung,null,[this,rechterKnoten],[neueMitte]);
      rechterKnoten.mutterknoten = this.mutterknoten;
      return this.mutterknoten;
    }
    return this.mutterknoten._insert_getrennte(neueMitte,rechterKnoten);
  }

  _insert_getrennte(neueMitte,rechterKnoten) {
    var pos = this._finde_position(neueMitte.getSchluesselwert());
    this.eintraege.splice(pos,0,neueMitte);
    this.unterbaeume.splice(pos+1,0,rechterKnoten);
    return this._insert_ueberlauf();
  }

}

module.exports = Knoten;
