function jjencode(gv, text) {
  var r = "";
  var n;
  var t;
  var b = [
    "___",
    "__$",
    "_$_",
    "_$$",
    "$__",
    "$_$",
    "$$_",
    "$$$",
    "$___",
    "$__$",
    "$_$_",
    "$_$$",
    "$$__",
    "$$_$",
    "$$$_",
    "$$$$",
  ];
  var s = "";
  for (var i = 0; i < text.length; i++) {
    n = text.charCodeAt(i);
    if (n == 0x22 || n == 0x5c) {
      s += "\\\\\\" + text.charAt(i).toString(16);
    } else if (
      (0x21 <= n && n <= 0x2f) ||
      (0x3a <= n && n <= 0x40) ||
      (0x5b <= n && n <= 0x60) ||
      (0x7b <= n && n <= 0x7f)
    ) {
      //}else if( (0x20 <= n && n <= 0x2f) || (0x3A <= n == 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ){
      s += text.charAt(i);
    } else if ((0x30 <= n && n <= 0x39) || (0x61 <= n && n <= 0x66)) {
      if (s) r += '"' + s + '"+';
      r += gv + "." + b[n < 0x40 ? n - 0x30 : n - 0x57] + "+";
      s = "";
    } else if (n == 0x6c) {
      // 'l'
      if (s) r += '"' + s + '"+';
      r += '(![]+"")[' + gv + "._$_]+";
      s = "";
    } else if (n == 0x6f) {
      // 'o'
      if (s) r += '"' + s + '"+';
      r += gv + "._$+";
      s = "";
    } else if (n == 0x74) {
      // 'u'
      if (s) r += '"' + s + '"+';
      r += gv + ".__+";
      s = "";
    } else if (n == 0x75) {
      // 'u'
      if (s) r += '"' + s + '"+';
      r += gv + "._+";
      s = "";
    } else if (n < 128) {
      if (s) r += '"' + s;
      else r += '"';
      r +=
        '\\\\"+' +
        n.toString(8).replace(/[0-7]/g, function (c) {
          return gv + "." + b[c] + "+";
        });
      s = "";
    } else {
      if (s) r += '"' + s;
      else r += '"';
      r +=
        '\\\\"+' +
        gv +
        "._+" +
        n.toString(16).replace(/[0-9a-f]/gi, function (c) {
          return gv + "." + b[parseInt(c, 16)] + "+";
        });
      s = "";
    }
  }
  if (s) r += '"' + s + '"+';
  r =
    gv +
    "=~[];" +
    gv +
    "={___:++" +
    gv +
    ',$$$$:(![]+"")[' +
    gv +
    "],__$:++" +
    gv +
    ',$_$_:(![]+"")[' +
    gv +
    "],_$_:++" +
    gv +
    ',$_$$:({}+"")[' +
    gv +
    "],$$_$:(" +
    gv +
    "[" +
    gv +
    ']+"")[' +
    gv +
    "],_$$:++" +
    gv +
    ',$$$_:(!""+"")[' +
    gv +
    "],$__:++" +
    gv +
    ",$_$:++" +
    gv +
    ',$$__:({}+"")[' +
    gv +
    "],$$_:++" +
    gv +
    ",$$$:++" +
    gv +
    ",$___:++" +
    gv +
    ",$__$:++" +
    gv +
    "};" +
    gv +
    ".$_=" +
    "(" +
    gv +
    ".$_=" +
    gv +
    '+"")[' +
    gv +
    ".$_$]+" +
    "(" +
    gv +
    "._$=" +
    gv +
    ".$_[" +
    gv +
    ".__$])+" +
    "(" +
    gv +
    ".$$=(" +
    gv +
    '.$+"")[' +
    gv +
    ".__$])+" +
    "((!" +
    gv +
    ')+"")[' +
    gv +
    "._$$]+" +
    "(" +
    gv +
    ".__=" +
    gv +
    ".$_[" +
    gv +
    ".$$_])+" +
    "(" +
    gv +
    '.$=(!""+"")[' +
    gv +
    ".__$])+" +
    "(" +
    gv +
    '._=(!""+"")[' +
    gv +
    "._$_])+" +
    gv +
    ".$_[" +
    gv +
    ".$_$]+" +
    gv +
    ".__+" +
    gv +
    "._$+" +
    gv +
    ".$;" +
    gv +
    ".$$=" +
    gv +
    ".$+" +
    '(!""+"")[' +
    gv +
    "._$$]+" +
    gv +
    ".__+" +
    gv +
    "._+" +
    gv +
    ".$+" +
    gv +
    ".$$;" +
    gv +
    ".$=(" +
    gv +
    ".___)[" +
    gv +
    ".$_][" +
    gv +
    ".$_];" +
    gv +
    ".$(" +
    gv +
    ".$(" +
    gv +
    '.$$+"\\""+' +
    r +
    '"\\"")())();';
  return r;
}
function jjdecode(t) {
  var out = "";
  //clean it
  t.replace(/^\s+|\s+$/g, "");
  var startpos;
  var endpos;
  var gv;
  var gvl;
  if (t.indexOf('"\'\\"+\'+",') == 0) {
    //palindrome check
    //locate jjcode
    startpos = t.indexOf('$$+"\\""+') + 8;
    endpos = t.indexOf('"\\"")())()');
    //get gv
    gv = t.substring(t.indexOf('"\'\\"+\'+",') + 9, t.indexOf("=~[]"));
    gvl = gv.length;
  } else {
    //get gv
    gv = t.substr(0, t.indexOf("="));
    gvl = gv.length;
    //locate jjcode
    startpos = t.indexOf('"\\""+') + 5;
    endpos = t.indexOf('"\\"")())()');
  }
  if (startpos == endpos) {
    alert("No data !");
    return;
  }
  //start decoding
  var data = t.substring(startpos, endpos);
  //hex decode string
  var b = [
    "___+",
    "__$+",
    "_$_+",
    "_$$+",
    "$__+",
    "$_$+",
    "$$_+",
    "$$$+",
    "$___+",
    "$__$+",
    "$_$_+",
    "$_$$+",
    "$$__+",
    "$$_$+",
    "$$$_+",
    "$$$$+",
  ];
  //lotu
  var str_l = '(![]+"")[' + gv + "._$_]+";
  var str_o = gv + "._$+";
  var str_t = gv + ".__+";
  var str_u = gv + "._+";
  //0123456789abcdef
  var str_hex = gv + ".";
  //s
  var str_s = '"';
  var gvsig = gv + ".";
  var str_quote = '\\\\\\"';
  var str_slash = "\\\\\\\\";
  var str_lower = '\\\\"+';
  var str_upper = '\\\\"+' + gv + "._+";
  var str_end = '"+'; //end of s loop
  while (data != "") {
    //l o t u
    if (0 == data.indexOf(str_l)) {
      data = data.substr(str_l.length);
      out += "l";
      continue;
    } else if (0 == data.indexOf(str_o)) {
      data = data.substr(str_o.length);
      out += "o";
      continue;
    } else if (0 == data.indexOf(str_t)) {
      data = data.substr(str_t.length);
      out += "t";
      continue;
    } else if (0 == data.indexOf(str_u)) {
      data = data.substr(str_u.length);
      out += "u";
      continue;
    }
    //0123456789abcdef
    if (0 == data.indexOf(str_hex)) {
      data = data.substr(str_hex.length);
      //check every element of hex decode string for a match
      var i = 0;
      for (i = 0; i < b.length; i++) {
        if (0 == data.indexOf(b[i])) {
          data = data.substr(b[i].length);
          out += i.toString(16);
          break;
        }
      }
      continue;
    }
    //start of s block
    if (0 == data.indexOf(str_s)) {
      data = data.substr(str_s.length);
      //check if "R
      if (0 == data.indexOf(str_upper)) {
        // r4 n >= 128
        data = data.substr(str_upper.length); //skip sig
        var ch_str = "";
        for (
          let j = 0;
          j < 2;
          j++ //shouldn't be more than 2 hex chars
        ) {
          //gv + "."+b[ c ]
          if (0 == data.indexOf(gvsig)) {
            data = data.substr(gvsig.length); //skip gvsig
            for (
              let k = 0;
              k < b.length;
              k++ //for every entry in b
            ) {
              if (0 == data.indexOf(b[k])) {
                data = data.substr(b[k].length);
                ch_str += k.toString(16) + "";
                break;
              }
            }
          } else {
            break; //done
          }
        }
        out += String.fromCharCode(parseInt(ch_str, 16));
        continue;
      } else if (0 == data.indexOf(str_lower)) {
        //r3 check if "R // n < 128
        data = data.substr(str_lower.length); //skip sig
        var ch_str = "";
        var ch_lotux = "";
        var temp = "";
        var b_checkR1 = 0;
        for (
          let j = 0;
          j < 3;
          j++ //shouldn't be more than 3 octal chars
        ) {
          if (j > 1) {
            //lotu check
            if (0 == data.indexOf(str_l)) {
              data = data.substr(str_l.length);
              ch_lotux = "l";
              break;
            } else if (0 == data.indexOf(str_o)) {
              data = data.substr(str_o.length);
              ch_lotux = "o";
              break;
            } else if (0 == data.indexOf(str_t)) {
              data = data.substr(str_t.length);
              ch_lotux = "t";
              break;
            } else if (0 == data.indexOf(str_u)) {
              data = data.substr(str_u.length);
              ch_lotux = "u";
              break;
            }
          }
          //gv + "."+b[ c ]
          if (0 == data.indexOf(gvsig)) {
            temp = data.substr(gvsig.length);
            for (
              let k = 0;
              k < 8;
              k++ //for every entry in b octal
            ) {
              if (0 == temp.indexOf(b[k])) {
                if (parseInt(ch_str + k + "", 8) > 128) {
                  b_checkR1 = 1;
                  break;
                }
                ch_str += k + "";
                data = data.substr(gvsig.length); //skip gvsig
                data = data.substr(b[k].length);
                break;
              }
            }
            if (1 == b_checkR1) {
              if (0 == data.indexOf(str_hex)) {
                //0123456789abcdef
                data = data.substr(str_hex.length);
                //check every element of hex decode string for a match
                var i = 0;
                for (i = 0; i < b.length; i++) {
                  if (0 == data.indexOf(b[i])) {
                    data = data.substr(b[i].length);
                    ch_lotux = i.toString(16);
                    break;
                  }
                }
                break;
              }
            }
          } else {
            break; //done
          }
        }
        out += String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux;
        continue; //step out of the while loop
      } //"S ----> "SR or "S+
      else {
        // if there is, loop s until R 0r +
        // if there is no matching s block, throw error
        var match = 0;
        var n;
        //searching for mathcing pure s block
        while (true) {
          n = data.charCodeAt(0);
          if (0 == data.indexOf(str_quote)) {
            data = data.substr(str_quote.length);
            out += '"';
            match += 1;
            continue;
          } else if (0 == data.indexOf(str_slash)) {
            data = data.substr(str_slash.length);
            out += "\\";
            match += 1;
            continue;
          } else if (0 == data.indexOf(str_end)) {
            //reached end off S block ? +
            if (match == 0) {
              alert("+ no match S block: " + data);
              return;
            }
            data = data.substr(str_end.length);
            break; //step out of the while loop
          } else if (0 == data.indexOf(str_upper)) {
            //r4 reached end off S block ? - check if "R n >= 128
            if (match == 0) {
              alert("no match S block n>128: " + data);
              return;
            }
            data = data.substr(str_upper.length); //skip sig
            var ch_str = "";
            var ch_lotux = "";
            for (
              let j = 0;
              j < 10;
              j++ //shouldn't be more than 10 hex chars
            ) {
              if (j > 1) {
                //lotu check
                if (0 == data.indexOf(str_l)) {
                  data = data.substr(str_l.length);
                  ch_lotux = "l";
                  break;
                } else if (0 == data.indexOf(str_o)) {
                  data = data.substr(str_o.length);
                  ch_lotux = "o";
                  break;
                } else if (0 == data.indexOf(str_t)) {
                  data = data.substr(str_t.length);
                  ch_lotux = "t";
                  break;
                } else if (0 == data.indexOf(str_u)) {
                  data = data.substr(str_u.length);
                  ch_lotux = "u";
                  break;
                }
              }
              //gv + "."+b[ c ]
              if (0 == data.indexOf(gvsig)) {
                data = data.substr(gvsig.length); //skip gvsig
                for (
                  let k = 0;
                  k < b.length;
                  k++ //for every entry in b
                ) {
                  if (0 == data.indexOf(b[k])) {
                    data = data.substr(b[k].length);
                    ch_str += k.toString(16) + "";
                    break;
                  }
                }
              } else {
                break; //done
              }
            }
            out += String.fromCharCode(parseInt(ch_str, 16));
            break; //step out of the while loop
          } else if (0 == data.indexOf(str_lower)) {
            //r3 check if "R // n < 128
            if (match == 0) {
              alert("no match S block n<128: " + data);
              return;
            }
            data = data.substr(str_lower.length); //skip sig
            var ch_str = "";
            var ch_lotux = "";
            var temp = "";
            var b_checkR1 = 0;
            for (
              let j = 0;
              j < 3;
              j++ //shouldn't be more than 3 octal chars
            ) {
              if (j > 1) {
                //lotu check
                if (0 == data.indexOf(str_l)) {
                  data = data.substr(str_l.length);
                  ch_lotux = "l";
                  break;
                } else if (0 == data.indexOf(str_o)) {
                  data = data.substr(str_o.length);
                  ch_lotux = "o";
                  break;
                } else if (0 == data.indexOf(str_t)) {
                  data = data.substr(str_t.length);
                  ch_lotux = "t";
                  break;
                } else if (0 == data.indexOf(str_u)) {
                  data = data.substr(str_u.length);
                  ch_lotux = "u";
                  break;
                }
              }
              //gv + "."+b[ c ]
              if (0 == data.indexOf(gvsig)) {
                temp = data.substr(gvsig.length);
                for (
                  let k = 0;
                  k < 8;
                  k++ //for every entry in b octal
                ) {
                  if (0 == temp.indexOf(b[k])) {
                    if (parseInt(ch_str + k + "", 8) > 128) {
                      b_checkR1 = 1;
                      break;
                    }
                    ch_str += k + "";
                    data = data.substr(gvsig.length); //skip gvsig
                    data = data.substr(b[k].length);
                    break;
                  }
                }
                if (1 == b_checkR1) {
                  if (0 == data.indexOf(str_hex)) {
                    //0123456789abcdef
                    data = data.substr(str_hex.length);
                    //check every element of hex decode string for a match
                    var i = 0;
                    for (i = 0; i < b.length; i++) {
                      if (0 == data.indexOf(b[i])) {
                        data = data.substr(b[i].length);
                        ch_lotux = i.toString(16);
                        break;
                      }
                    }
                  }
                }
              } else {
                break; //done
              }
            }
            out += String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux;
            break; //step out of the while loop
          } else if (
            (0x21 <= n && n <= 0x2f) ||
            (0x3a <= n && n <= 0x40) ||
            (0x5b <= n && n <= 0x60) ||
            (0x7b <= n && n <= 0x7f)
          ) {
            out += data.charAt(0);
            data = data.substr(1);
            match += 1;
          }
        }
        continue;
      }
    }
    alert("no match : " + data);
    break;
  }
  return out;
}
function jjEncode(text) {
  var r = jjencode("$", text);
  const palindrome = false;
  if (palindrome) {
    r = r.replace(/[,;]$/, "");
    r =
      '"\'\\"+\'+",' +
      r +
      ",'," +
      r.split("").reverse().join("") +
      ',"+\'+"\\\'"';
  }
  return r;
}
function jjDecode(text) {
  return jjdecode(text);
}

function aaencode(text) {
  var t;
  var b = [
    "(c^_^o)",
    "(ﾟΘﾟ)",
    "((o^_^o) - (ﾟΘﾟ))",
    "(o^_^o)",
    "(ﾟｰﾟ)",
    "((ﾟｰﾟ) + (ﾟΘﾟ))",
    "((o^_^o) +(o^_^o))",
    "((ﾟｰﾟ) + (o^_^o))",
    "((ﾟｰﾟ) + (ﾟｰﾟ))",
    "((ﾟｰﾟ) + (ﾟｰﾟ) + (ﾟΘﾟ))",
    "(ﾟДﾟ) .ﾟωﾟﾉ",
    "(ﾟДﾟ) .ﾟΘﾟﾉ",
    "(ﾟДﾟ) ['c']",
    "(ﾟДﾟ) .ﾟｰﾟﾉ",
    "(ﾟДﾟ) .ﾟДﾟﾉ",
    "(ﾟДﾟ) [ﾟΘﾟ]",
  ];
  var r =
    "ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_']; o=(ﾟｰﾟ)  =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); ";
  if (/ひだまりスケッチ×(365|３５６)\s*来週も見てくださいね[!！]/.test(text)) {
    r += "X=_=3; ";
    r += '\r\n\r\n    X / _ / X < "来週も見てくださいね!";\r\n\r\n';
  }
  r +=
    "(ﾟДﾟ) =(ﾟΘﾟ)= (o^_^o)/ (o^_^o);" +
    "(ﾟДﾟ)={ﾟΘﾟ: '_' ,ﾟωﾟﾉ : ((ﾟωﾟﾉ==3) +'_') [ﾟΘﾟ] " +
    ",ﾟｰﾟﾉ :(ﾟωﾟﾉ+ '_')[o^_^o -(ﾟΘﾟ)] " +
    ",ﾟДﾟﾉ:((ﾟｰﾟ==3) +'_')[ﾟｰﾟ] }; (ﾟДﾟ) [ﾟΘﾟ] =((ﾟωﾟﾉ==3) +'_') [c^_^o];" +
    "(ﾟДﾟ) ['c'] = ((ﾟДﾟ)+'_') [ (ﾟｰﾟ)+(ﾟｰﾟ)-(ﾟΘﾟ) ];" +
    "(ﾟДﾟ) ['o'] = ((ﾟДﾟ)+'_') [ﾟΘﾟ];" +
    "(ﾟoﾟ)=(ﾟДﾟ) ['c']+(ﾟДﾟ) ['o']+(ﾟωﾟﾉ +'_')[ﾟΘﾟ]+ ((ﾟωﾟﾉ==3) +'_') [ﾟｰﾟ] + " +
    "((ﾟДﾟ) +'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ ((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+" +
    "((ﾟｰﾟ==3) +'_') [(ﾟｰﾟ) - (ﾟΘﾟ)]+(ﾟДﾟ) ['c']+" +
    "((ﾟДﾟ)+'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ (ﾟДﾟ) ['o']+" +
    "((ﾟｰﾟ==3) +'_') [ﾟΘﾟ];(ﾟДﾟ) ['_'] =(o^_^o) [ﾟoﾟ] [ﾟoﾟ];" +
    "(ﾟεﾟ)=((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟДﾟ) .ﾟДﾟﾉ+" +
    "((ﾟДﾟ)+'_') [(ﾟｰﾟ) + (ﾟｰﾟ)]+((ﾟｰﾟ==3) +'_') [o^_^o -ﾟΘﾟ]+" +
    "((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟωﾟﾉ +'_') [ﾟΘﾟ]; " +
    "(ﾟｰﾟ)+=(ﾟΘﾟ); (ﾟДﾟ)[ﾟεﾟ]='\\\\'; " +
    "(ﾟДﾟ).ﾟΘﾟﾉ=(ﾟДﾟ+ ﾟｰﾟ)[o^_^o -(ﾟΘﾟ)];" +
    "(oﾟｰﾟo)=(ﾟωﾟﾉ +'_')[c^_^o];" + //TODO
    "(ﾟДﾟ) [ﾟoﾟ]='\\\"';" +
    "(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] (ﾟεﾟ+";
  r += "(ﾟДﾟ)[ﾟoﾟ]+ ";
  for (var i = 0; i < text.length; i++) {
    let n = text.charCodeAt(i);
    t = "(ﾟДﾟ)[ﾟεﾟ]+";
    if (n <= 127) {
      t += n.toString(8).replace(/[0-7]/g, function (c) {
        return b[c] + "+ ";
      });
    } else {
      var m = /[0-9a-f]{4}$/.exec("000" + n.toString(16))[0];
      t +=
        "(oﾟｰﾟo)+ " +
        m.replace(/[0-9a-f]/gi, function (c) {
          return b[parseInt(c, 16)] + "+ ";
        });
    }
    r += t;
  }
  r += "(ﾟДﾟ)[ﾟoﾟ]) (ﾟΘﾟ)) ('_');";
  return r;
}
function aadecode(text) {
  var evalPreamble =
    "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
  var decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
  var evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
  var decodePostamble = ") ());";
  // strip beginning/ending space.
  text = text.replace(/^\s*/, "").replace(/\s*$/, "");
  // returns empty text for empty input.
  if (/^\s*$/.test(text)) {
    return "";
  }
  // check if it is encoded.
  if (text.lastIndexOf(evalPreamble) < 0) {
    throw new Error("Given code is not encoded as aaencode.");
  }
  if (text.lastIndexOf(evalPostamble) != text.length - evalPostamble.length) {
    throw new Error("Given code is not encoded as aaencode.");
  }
  var decodingScript = text
    .replace(evalPreamble, decodePreamble)
    .replace(evalPostamble, decodePostamble);
  return eval(decodingScript);
}
function aaDecode2(t) {
  t = t.replace(") ('_')", "");
  t = t.replace("(ﾟДﾟ) ['_'] (", "return ");
  var x = new Function(t);
  var r = x();
  return r;
}
function aaEncode(text) {
  return aaencode(text);
}
function aaDecode(text) {
  return aadecode(text);
}

module.exports = { jjEncode, aaEncode };
