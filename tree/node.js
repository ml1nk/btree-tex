/*
 * Ein beliebiger Vielwegbaum sollte sich durch die folgende Klasse erselle
 */

class node {

  constructor(logic, keys, subs) {
    this.logic = logic;
    this.keys = keys;
    this.subs = subs;
    this.supra = null;
  }

  insertLeft(pos, key, sub) {
    return this._insert(pos,0,key,sub);
  }

  insertRight(pos, key, sub) {
    return this._insert(pos,1,key,sub);
  }

  _insert(pos, shift, key, sub) {
    this.keys.splice(pos,0,key);
    this.subs.splice(pos+shift,0,sub);
    if(sub !== null) {
      sub.supra = this;
    }
  }

  setKey(pos, key) {
    this.keys[pos] = key;
  }

  setSub(pos, sub) {
    this.subs[pos] = sub;
    if(sub!==null) {
      sub.supra = this;
    }
  }

  deleteLeft(pos) {
    return this._delete(pos,0);
  }

  deleteRight(pos) {
    return this._delete(pos,1);
  }

  _delete(pos, shift) {
    var key = this.keys.splice(pos,1)[0];
    var sub = this.subs.splice(pos+shift,1)[0];
    if(sub.supra !== null) {
      sub.supra = null;
    }
    return {
      key : key,
      sub : sub
    };
  }

  getSupra() {
    return this.supra;
  }

  getSub(i) {
    return this.subs[i];
  }

  getKey(i) {
    return this.keys[i];
  }

  getPos(me) {
    for(let i=0; i<this.subs.length;i++) {
      if(this.subs[i] === me) {
        return i;
      }
    }
    return false;
  }

  count() {
    return this.keys.length;
  }

  isLeaf() {
    for(let i=0; i<this.subs.length; i++) {
      if(this.subs[i] !== null) {
        return false;
      }
    }
    return true;
  }

  moveUpLeft() {
    return this._moveUp(true);
  }

  moveUpRight() {
    return this._moveUp(false);
  }

  _moveUp(left) {
    let newSupra = false;
    if(this.supra === null) {
      newSupra = true;
      this.supra = new node(this.logic,[], [null]);
    }

    let sub = this.subs.splice(left ? 0 : this.keys.length,1)[0];
    let key = this.keys.splice(left ? 0 : this.keys.length-1,1)[0];

    if(sub!==null) {
      sub.supra = this.supra;
    }
    let me = this.supra.getPos(this);
    this.supra[left ? "insertLeft" : "insertRight"](me,key,sub);

    if(this.keys.length === 0) {
      this.supra.setSub(me + (left ? 1 : 0), this.subs[0]);
      this.supra = null;
    }
    return newSupra ? this.supra : true;
  }

  moveDownLeft(pos) {
    return this._moveDown(pos,true);
  }

  moveDownRight(pos) {
    return this._moveDown(pos,true);
  }

  _moveDown(pos,left) {
    if(pos>=this.keys.length) {
      return false;
    }
    let deleted = this[left ? "deleteRight" : "deleteLeft"](pos);

    if(this.subs[pos] === null) {
      this.subs[pos] = new node(this, [], [null]);
    }

    this.subs[pos][left ? "insertRight" : "insertLeft"](left ? this.subs[pos].subs.length : 0, deleted.key, deleted.sub);

    if(this.keys.length === 0) {
      this.subs[0].supra = this.supra;
      this.supra = null;
      if(this.subs[0].supra !== null) {
        this.subs[0].supra.setSub(this.subs[0].supra.getPos(this), this.subs[0]);
      } else {
        return this.subs[0];
      }
    }



    return true;
  }

  merge(pos) {
    if(pos>=this.keys.length) {
      return false;
    }

    let key = this.keys.splice(pos,1)[0];
    let [left, right] = this.subs.splice(pos,2);

    let keys = [key];
    let subs = [];

    if(left !== null) {
      subs = left.subs.concat(subs);
      keys = left.keys.concat(keys);
      left.supra = null;
    } else {
      subs.unshift(null);
    }

    if(right !== null) {
      subs = subs.concat(right.subs);
      keys = keys.concat(right.keys);
      right.supra = null;
    } else {
      subs.push(null);
    }

    var merged = width(this.logic, subs, keys);
    if(this.keys.length > 0) {
      merged.supra = this;
      this.subs.splice(pos,0,merged);
    } else {
      if(this.supra === null) {
        return merged;
      }
      this.supra.setSub(this.supra.getPos(this), merged);
      merged.supra = this.supra;
      this.supra = null;
    }
    return true;
  }

  split(pos) {
    if(pos>=this.keys.length) {
      return false;
    }

    if(this.supra === null) {

    }

    // Randbedingung ()
    if(pos === 0) {
      let sub = this.subs.splice(pos,1)[0];
      sub.supra = this.supra;
      this.insertRight(this.supra.getPos(this),this.keys.splice(pos,1)[0],sub);
    } else if(pos === this.keys.length-1){
      let sub = this.subs.splice(pos+1,1);
      sub.supra = this.supra;
      this.insertRight(this.supra.getPos(this),this.keys.splice(pos,1)[0],sub);
    }

  }

  data() {
      var output = [];
      output.push(this.subs[0] === null ? null : this.subs[0].data());
      for(let i=0; i<this.keys.length; i++) {
          output.push(this.keys[i]);
          output.push(this.subs[i+1] === null ? null : this.subs[i+1].data());
      }
      return output;
  }
}

module.exports = node;
