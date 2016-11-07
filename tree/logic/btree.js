function generate(options,node) {
  let degree = options.degree ? options.degree : 2;
  let plus = options.plus ? options.plus : false;
  let leftOrientation = options.leftOrientation ? options.leftOrientation : false;

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
    let splitPos = Math.floor(me.keys.length/2);

    // B+ Tree
    if(plus && me.subs[0]===null) {
      me.insertLeft(splitPos+(leftOrientation ? 0 : 1),me.keys[splitPos],null);
      splitPos+=leftOrientation ? 1 : 0;
    }
    let result = me.split(splitPos);
    if(result === true) {
      return _insert_ueberlauf(me.supra);
    }
    return result;
  }

  // todo: write delete function for btree/b+tree
  function _delete(me, key) {
    return false;
  }

  function _read(me, key) {
    for(let i=0; i<me.keys.length; i++) {
      if(me.keys[i] > key) {
        return (me.subs.length===0) ? false : _read(me.subs[i], key);
      } else if(me.keys[i] === key) {
        return { node : me, pos : i};
      }
    }
    return (me.subs.length===0) ? false : _read(me.subs[me.subs.length-1], key);
  }

  return {
    insert : _insert,
    delete : _delete,
    read : _read
  };
}

module.exports = generate;
