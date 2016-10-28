function generate(options,node) {
  let degree = options.degree ? options.degree : 2;

  function _insert(me, key) {
    for(let i=0; i<me.keys.length; i++) {
      if(me.keys[i] > key) {
        return (me.subs[i]===null) ? _insert_eintrag(me, i, key) : _insert(me.subs[i], key);
      } else if(me.keys[i] === key) {
        return false;
      }
    }
    return (me.subs[me.subs.length-1]===null) ? _insert_eintrag(me,me.subs.length-1, key) : _insert(me.subs[me.subs.length-1],key);
  }

  function _insert_eintrag(me, i, key) {
      me.insertRight(i, key, null);
      return _insert_ueberlauf(me);
  }

  function _insert_ueberlauf(me) {
    if(me.keys.length<degree+1) {
      return true;
    }
    return me.split(Math.floor(me.keys.length/2));
  }

  function _delete(me, key) {
    var result = _read(me, key);
    if(result === false) {
      return false;
    }
    if(result.node.subs[0] === null) {
        return _delete_leaf(me, result.node, result.pos);
    }
    var nextNode = result.node.subs[result.pos+1];
    while(nextNode.subs.length>0) {
      nextNode = nextNode.subs[0];
    }
    result.node.keys[result.pos] = nextNode.keys[0];
    return _delete_leaf(me, nextNode,0);
  }

  function _delete_leaf(me, node, pos) {
    this.keys.splice(eintrag,1);
    if(this.subs.length>0) {
      this.subs.splice(eintrag+pos,1);
    }

    if(this.keys.length>=this.ordnung) {
      return true;
    }

    var mitte = this.supra._finde_position(this.keys[0].getSchluesselwert());
    if(mitte>0) {
        let links = this.supra.subs[mitte-1];
        if(links.keys.length>this.ordnung) {
          let k = Math.floor((links.keys.length-this.ordnung)/2);
          let keys = links.keys.splice(links.keys.length-k,k);
          let subs = links.subs.length>0 ? links.subs.splice(this.ordnung+1,k) : [];
          let neueMitte = keys.shift();
          keys.push(this.supra.keys[mitte-1]);
          this.keys = keys.concat(this.keys);
          this.subs = subs.concat(this.subs);
          this.supra.keys[mitte-1] = neueMitte;
          return true;
        }
    }

    if(this.supra.subs.length>mitte+1) {
      let rechts = this.supra.subs[mitte+1];
      if(rechts.keys.length>this.ordnung) {
        let k = Math.floor(rechts.keys.length-this.ordnung/2);
        let keys = rechts.keys.splice(0,k);
        let subs = rechts.subs.length>0 ? rechts.subs.splice(0,k) : [];
        let neueMitte = keys.pop();
        keys.unshift(this.supra.keys[mitte-1]);
        this.keys = this.keys.concat(keys);
        this.subs = this.subs.concat(subs);
        this.supra.keys[mitte-1] = neueMitte;
        return true;
      }
    }

    if(mitte>0) {
      let links = this.supra.subs[mitte-1];
      links.keys.push(this.supra.keys[mitte]);
      links.keys.concat(this.keys);
      for(let i=0; i<this.subs.length;i++) {
          this.subs[i].supra = links;
      }
      links.subs.concat(this.subs);
      return this.supra._delete(mitte,1);
    } else {
      let rechts = this.supra.subs[mitte+1];
      this.keys.push(this.supra.keys[mitte]);
      rechts.keys = this.keys.concat(rechts.keys);
      for(let i=0; i<this.subs.length;i++) {
          this.subs[i].supra = rechts;
      }
      rechts.unterbaeum = this.subs.concat(rechts.subs);
      return this.supra._delete(mitte,0);
    }
  }



  function _read(me, key) {
    for(let i=0; i<me.keys.length; i++) {
      if(me.keys[i] > key) {
        return (me.subs.length===0) ? false : me.subs[i]._read(me, key);
      } else if(me.keys[i] === key) {
        return { node : me, pos : i};
      }
    }
    return (me.subs.length===0) ? false : me.subs[me.subs.length-1]._read(me, key);
  }

  return {
    insert : _insert,
    delete : _delete
  };
}

module.exports = generate;


/*


insert(key, satz) {
  for(let i=0; i<this.keys.length; i++) {
    if(this.keys[i].getSchluesselwert() > schluesselwert) {
      return (this.subs.length===0) ? this._insert_eintrag(i, schluesselwert, satz) : this.subs[i].insert(schluesselwert, satz);
    } else if(this.keys[i].getSchluesselwert() === schluesselwert) {
      this.keys[i] = new Eintrag(schluesselwert, satz);
      return false;
    }
  }
  return (this.subs.length===0) ? this._insert_eintrag(this.keys.length, schluesselwert, satz) : this.subs[this.subs.length-1].insert(schluesselwert, satz);
}

delete(schluesselwert) {
  var result = this._read(schluesselwert);
  if(result === false) {
    return false;
  }

  // Blatt?
  if(result.knoten.subs.length === 0) {
      return result.knoten._delete(result.eintrag,0);
  }

  var naechstenKnoten = result.knoten.subs[result.eintrag+1];
  while(naechstenKnoten.subs.length>0) {
    naechstenKnoten = naechstenKnoten.subs[0];
  }
  result.knoten.keys[result.eintrag] = naechstenKnoten.keys[0];
  return naechstenKnoten._delete(0,0);
}

_finde_position(schluesselwert) {
  for(let i = 0; i<this.keys.length;i++) {
      if(this.keys[i].getSchluesselwert()>schluesselwert) {
        return i;
      }
  }
  return this.keys.length;
}


_delete(eintrag,pos) {
  this.keys.splice(eintrag,1);
  if(this.subs.length>0) {
    this.subs.splice(eintrag+pos,1);
  }

  if(this.keys.length>=this.ordnung) {
    return true;
  }

  var mitte = this.supra._finde_position(this.keys[0].getSchluesselwert());
  if(mitte>0) {
      let links = this.supra.subs[mitte-1];
      if(links.keys.length>this.ordnung) {
        let k = Math.floor((links.keys.length-this.ordnung)/2);
        let keys = links.keys.splice(links.keys.length-k,k);
        let subs = links.subs.length>0 ? links.subs.splice(this.ordnung+1,k) : [];
        let neueMitte = keys.shift();
        keys.push(this.supra.keys[mitte-1]);
        this.keys = keys.concat(this.keys);
        this.subs = subs.concat(this.subs);
        this.supra.keys[mitte-1] = neueMitte;
        return true;
      }
  }

  if(this.supra.subs.length>mitte+1) {
    let rechts = this.supra.subs[mitte+1];
    if(rechts.keys.length>this.ordnung) {
      let k = Math.floor(rechts.keys.length-this.ordnung/2);
      let keys = rechts.keys.splice(0,k);
      let subs = rechts.subs.length>0 ? rechts.subs.splice(0,k) : [];
      let neueMitte = keys.pop();
      keys.unshift(this.supra.keys[mitte-1]);
      this.keys = this.keys.concat(keys);
      this.subs = this.subs.concat(subs);
      this.supra.keys[mitte-1] = neueMitte;
      return true;
    }
  }

  if(mitte>0) {
    let links = this.supra.subs[mitte-1];
    links.keys.push(this.supra.keys[mitte]);
    links.keys.concat(this.keys);
    for(let i=0; i<this.subs.length;i++) {
        this.subs[i].supra = links;
    }
    links.subs.concat(this.subs);
    return this.supra._delete(mitte,1);
  } else {
    let rechts = this.supra.subs[mitte+1];
    this.keys.push(this.supra.keys[mitte]);
    rechts.keys = this.keys.concat(rechts.keys);
    for(let i=0; i<this.subs.length;i++) {
        this.subs[i].supra = rechts;
    }
    rechts.unterbaeum = this.subs.concat(rechts.subs);
    return this.supra._delete(mitte,0);
  }
}

_read(schluesselwert) {
  for(let i=0; i<this.keys.length; i++) {
    if(this.keys[i].getSchluesselwert() > schluesselwert) {
      return (this.subs.length===0) ? false : this.subs[i]._read(schluesselwert);
    } else if(this.keys[i].getSchluesselwert() === schluesselwert) {
      return { knoten : this, eintrag : i};
    }
  }
  return (this.subs.length===0) ? false : this.subs[this.subs.length-1]._read(schluesselwert);
}

read(schluesselwert) {
  var result = this._read(schluesselwert);
  if(result === false) {
    return false;
  }
  return result.knoten.keys[result.eintrag].getSatz();
}

_insert_eintrag(pos, schluesselwert, satz) {
    this.keys.splice(pos,0, new Eintrag(schluesselwert, satz));
    return this._insert_ueberlauf();
}

_insert_ueberlauf() {
  if(this.keys.length!==this.ordnung*2+1) {
    return true;
  }
  var subs = this.subs.length>0 ? this.subs.splice(this.ordnung+1,this.ordnung+1) : [];
  var keys = this.keys.splice(this.ordnung,this.ordnung+1);
  var neueMitte = keys.shift();
  var rechterKnoten = new Knoten(this.ordnung,this.supra,subs,keys);
  for(let i=0; i<subs.length;i++) {
    subs[i].supra = rechterKnoten;
  }
  if(this.supra === null) {
    this.supra = new Knoten(this.ordnung,null,[this,rechterKnoten],[neueMitte]);
    rechterKnoten.supra = this.supra;
    return this.supra;
  }
  return this.supra._insert_getrennte(neueMitte,rechterKnoten);
}

_insert_getrennte(neueMitte,rechterKnoten) {
  var pos = this._finde_position(neueMitte.getSchluesselwert());
  this.keys.splice(pos,0,neueMitte);
  this.subs.splice(pos+1,0,rechterKnoten);
  return this._insert_ueberlauf();
}
*/
