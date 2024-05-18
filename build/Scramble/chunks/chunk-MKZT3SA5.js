import { f as Pe, g as T, i as dt, k as ht, m as q } from "./chunk-RSKU6P22.js";
import { c, d as u, e as l, f as mt, g as b } from "./chunk-YJ5RMHHJ.js";
function je(e, t, r) {
  let i = {};
  for (let n in e.orbits) {
    let a = e.orbits[n],
      o = t[n],
      s = r[n];
    if (Ie(a.numOrientations, s)) i[n] = o;
    else if (Ie(a.numOrientations, o)) i[n] = s;
    else {
      let m = new Array(a.numPieces);
      if (a.numOrientations === 1) {
        for (let h = 0; h < a.numPieces; h++)
          m[h] = o.permutation[s.permutation[h]];
        i[n] = { permutation: m, orientation: o.orientation };
      } else {
        let h = new Array(a.numPieces);
        for (let d = 0; d < a.numPieces; d++)
          (h[d] =
            (o.orientation[s.permutation[d]] + s.orientation[d]) %
            a.numOrientations),
            (m[d] = o.permutation[s.permutation[d]]);
        i[n] = { permutation: m, orientation: h };
      }
    }
  }
  return i;
}
function ft(e, t, r) {
  let i = {};
  for (let n in e.orbits) {
    let a = e.orbits[n],
      o = t[n],
      s = r[n];
    if (Ie(a.numOrientations, s)) i[n] = o;
    else {
      let m = new Array(a.numPieces);
      if (a.numOrientations === 1) {
        for (let h = 0; h < a.numPieces; h++) m[h] = o.pieces[s.permutation[h]];
        i[n] = { pieces: m, orientation: o.orientation };
      } else {
        let h = new Array(a.numPieces);
        for (let d = 0; d < a.numPieces; d++)
          (h[d] =
            (o.orientation[s.permutation[d]] + s.orientation[d]) %
            a.numOrientations),
            (m[d] = o.pieces[s.permutation[d]]);
        i[n] = { pieces: m, orientation: h };
      }
    }
  }
  return i;
}
var gt = !1,
  pt = new Map();
function on(e) {
  let t = pt.get(e);
  if (t) return t;
  let r = new Array(e),
    i = new Array(e);
  for (let a = 0; a < e; a++) (r[a] = a), (i[a] = 0);
  let n = { permutation: r, orientation: i };
  return (
    gt && (Object.freeze(r), Object.freeze(i), Object.freeze(n)),
    pt.set(e, n),
    n
  );
}
function cn(e) {
  let t = {};
  for (let [r, i] of Object.entries(e.orbits)) t[r] = on(i.numPieces);
  return gt && Object.freeze(t), t;
}
function ln(e, t) {
  let r = t.quantum.toString(),
    i = e.definition.moves[r];
  if (!i) {
    let o = e.definition.experimentalDerivedMoves?.[r];
    o && (i = e.algToTransformation(o).transformationData);
  }
  if (i) return X(e, i, t.amount);
  let n = e.definition.moves[t.toString()];
  if (n) return n;
  let a = e.definition.moves[t.invert().toString()];
  if (a) return X(e, a, -1);
  throw new Error(`Invalid move for KPuzzle (${e.name()}): ${t}`);
}
var G = class {
    constructor(e, t) {
      (this.kpuzzle = e), (this.stateData = t);
    }
    toJSON() {
      return {
        experimentalPuzzleName: this.kpuzzle.name(),
        stateData: this.stateData,
      };
    }
    static fromTransformation(e) {
      let t = ft(
        e.kpuzzle.definition,
        e.kpuzzle.definition.startStateData,
        e.transformationData
      );
      return new G(e.kpuzzle, t);
    }
    apply(e) {
      return this.applyTransformation(this.kpuzzle.toTransformation(e));
    }
    applyTransformation(e) {
      if (e.isIdentityTransformation())
        return new G(this.kpuzzle, this.stateData);
      let t = ft(this.kpuzzle.definition, this.stateData, e.transformationData);
      return new G(this.kpuzzle, t);
    }
    applyMove(e) {
      return this.applyTransformation(this.kpuzzle.moveToTransformation(e));
    }
    applyAlg(e) {
      return this.applyTransformation(this.kpuzzle.algToTransformation(e));
    }
    experimentalToTransformation() {
      if (!this.kpuzzle.canConvertStateToUniqueTransformation()) return null;
      let e = {};
      for (let [t, r] of Object.entries(this.stateData)) {
        let i = { permutation: r.pieces, orientation: r.orientation };
        e[t] = i;
      }
      return new D(this.kpuzzle, e);
    }
    experimentalIsSolved(e) {
      if (!this.kpuzzle.definition.experimentalIsStateSolved)
        throw new Error(
          "`KState.experimentalIsSolved()` is not supported for this puzzle at the moment."
        );
      return this.kpuzzle.definition.experimentalIsStateSolved(this, e);
    }
  },
  P,
  vt,
  D =
    ((vt = class {
      constructor(e, t) {
        u(this, P, void 0);
        (this.kpuzzle = e), (this.transformationData = t);
      }
      toJSON() {
        return {
          experimentalPuzzleName: this.kpuzzle.name(),
          transformationData: this.transformationData,
        };
      }
      invert() {
        return new D(this.kpuzzle, St(this.kpuzzle, this.transformationData));
      }
      isIdentityTransformation() {
        return (
          c(this, P) ??
          l(this, P, this.isIdentical(this.kpuzzle.identityTransformation()))
        );
      }
      static experimentalConstructIdentity(e) {
        let t = new D(e, cn(e.definition));
        return l(t, P, !0), t;
      }
      isIdentical(e) {
        return mn(this.kpuzzle, this.transformationData, e.transformationData);
      }
      apply(e) {
        return this.applyTransformation(this.kpuzzle.toTransformation(e));
      }
      applyTransformation(e) {
        if (this.kpuzzle !== e.kpuzzle)
          throw new Error(
            `Tried to apply a transformation for a KPuzzle (${e.kpuzzle.name()}) to a different KPuzzle (${this.kpuzzle.name()}).`
          );
        return c(this, P)
          ? new D(this.kpuzzle, e.transformationData)
          : c(e, P)
          ? new D(this.kpuzzle, this.transformationData)
          : new D(
              this.kpuzzle,
              je(
                this.kpuzzle.definition,
                this.transformationData,
                e.transformationData
              )
            );
      }
      applyMove(e) {
        return this.applyTransformation(this.kpuzzle.moveToTransformation(e));
      }
      applyAlg(e) {
        return this.applyTransformation(this.kpuzzle.algToTransformation(e));
      }
      toKState() {
        return G.fromTransformation(this);
      }
      repetitionOrder() {
        return fn(this.kpuzzle.definition, this);
      }
      selfMultiply(e) {
        return new D(this.kpuzzle, X(this.kpuzzle, this.transformationData, e));
      }
    }),
    (P = new WeakMap()),
    vt);
function Ie(e, t) {
  let { permutation: r } = t,
    i = r.length;
  for (let n = 0; n < i; n++) if (r[n] !== n) return !1;
  if (e > 1) {
    let { orientation: n } = t;
    for (let a = 0; a < i; a++) if (n[a] !== 0) return !1;
  }
  return !0;
}
function un(e, t, r, i = {}) {
  for (let n = 0; n < e.numPieces; n++)
    if (
      (!i?.ignoreOrientation && t.orientation[n] !== r.orientation[n]) ||
      (!i?.ignorePermutation && t.permutation[n] !== r.permutation[n])
    )
      return !1;
  return !0;
}
function mn(e, t, r) {
  for (let [i, n] of Object.entries(e.definition.orbits))
    if (!un(n, t[i], r[i])) return !1;
  return !0;
}
function St(e, t) {
  let r = {};
  for (let i in e.definition.orbits) {
    let n = e.definition.orbits[i],
      a = t[i];
    if (Ie(n.numOrientations, a)) r[i] = a;
    else if (n.numOrientations === 1) {
      let o = new Array(n.numPieces);
      for (let s = 0; s < n.numPieces; s++) o[a.permutation[s]] = s;
      r[i] = { permutation: o, orientation: a.orientation };
    } else {
      let o = new Array(n.numPieces),
        s = new Array(n.numPieces);
      for (let m = 0; m < n.numPieces; m++) {
        let h = a.permutation[m];
        (o[h] = m),
          (s[h] =
            (n.numOrientations - a.orientation[m] + n.numOrientations) %
            n.numOrientations);
      }
      r[i] = { permutation: o, orientation: s };
    }
  }
  return r;
}
function X(e, t, r) {
  if (r === 1) return t;
  if (r < 0) return X(e, St(e, t), -r);
  if (r === 0) {
    let { transformationData: a } = e.identityTransformation();
    return a;
  }
  let i = t;
  r !== 2 && (i = X(e, t, Math.floor(r / 2)));
  let n = je(e.definition, i, i);
  return r % 2 === 0 ? n : je(e.definition, t, n);
}
var dn = class extends dt {
    traverseAlg(e, t) {
      let r = null;
      for (let i of e.childAlgNodes())
        r
          ? (r = r.applyTransformation(this.traverseAlgNode(i, t)))
          : (r = this.traverseAlgNode(i, t));
      return r ?? t.identityTransformation();
    }
    traverseGrouping(e, t) {
      let r = this.traverseAlg(e.alg, t);
      return new D(t, X(t, r.transformationData, e.amount));
    }
    traverseMove(e, t) {
      return t.moveToTransformation(e);
    }
    traverseCommutator(e, t) {
      let r = this.traverseAlg(e.A, t),
        i = this.traverseAlg(e.B, t);
      return r
        .applyTransformation(i)
        .applyTransformation(r.invert())
        .applyTransformation(i.invert());
    }
    traverseConjugate(e, t) {
      let r = this.traverseAlg(e.A, t),
        i = this.traverseAlg(e.B, t);
      return r.applyTransformation(i).applyTransformation(r.invert());
    }
    traversePause(e, t) {
      return t.identityTransformation();
    }
    traverseNewline(e, t) {
      return t.identityTransformation();
    }
    traverseLineComment(e, t) {
      return t.identityTransformation();
    }
  },
  hn = ht(dn);
function qe(e, t) {
  return t ? qe(t, e % t) : e;
}
function fn(e, t) {
  let r = 1;
  for (let i in e.orbits) {
    let n = e.orbits[i],
      a = t.transformationData[i],
      o = new Array(n.numPieces);
    for (let s = 0; s < n.numPieces; s++)
      if (!o[s]) {
        let m = s,
          h = 0,
          d = 0;
        for (
          ;
          (o[m] = !0),
            (h = h + a.orientation[m]),
            (d = d + 1),
            (m = a.permutation[m]),
            m !== s;

        );
        h !== 0 &&
          (d = (d * n.numOrientations) / qe(n.numOrientations, Math.abs(h))),
          (r = (r * d) / qe(r, d));
      }
  }
  return r;
}
var F,
  he,
  xt,
  k =
    ((xt = class {
      constructor(e, t) {
        u(this, F, void 0);
        u(this, he, void 0);
        (this.definition = e),
          l(this, F, new Map()),
          (this.experimentalPGNotation = t?.experimentalPGNotation);
      }
      name() {
        return this.definition.name;
      }
      identityTransformation() {
        return D.experimentalConstructIdentity(this);
      }
      moveToTransformation(e) {
        typeof e == "string" && (e = new T(e));
        let t = e.toString(),
          r = c(this, F).get(t);
        if (r) return new D(this, r);
        if (this.experimentalPGNotation) {
          let n = this.experimentalPGNotation.lookupMove(e);
          if (!n) throw new Error(`could not map to internal move: ${e}`);
          return c(this, F).set(t, n), new D(this, n);
        }
        let i = ln(this, e);
        return c(this, F).set(t, i), new D(this, i);
      }
      algToTransformation(e) {
        return typeof e == "string" && (e = new q(e)), hn(e, this);
      }
      toTransformation(e) {
        return typeof e == "string"
          ? this.algToTransformation(e)
          : e?.is?.(q)
          ? this.algToTransformation(e)
          : e?.is?.(T)
          ? this.moveToTransformation(e)
          : e;
      }
      startState() {
        return new G(this, this.definition.startStateData);
      }
      canConvertStateToUniqueTransformation() {
        return (
          c(this, he) ??
          l(
            this,
            he,
            (() => {
              for (let [e, t] of Object.entries(this.definition.orbits)) {
                let r = new Array(t.numPieces).fill(!1);
                for (let i of this.definition.startStateData[e].pieces)
                  r[i] = !0;
                for (let i of r) if (!i) return !1;
              }
              return !0;
            })()
          )
        );
      }
    }),
    (F = new WeakMap()),
    (he = new WeakMap()),
    xt);
function zi(e, t, r, i, n) {
  let o = e.orbits[t].pieces[r];
  if (o === null) return E;
  let s = o.facelets?.[i];
  return s === null
    ? E
    : typeof s == "string"
    ? s
    : n
    ? s.hintMask ?? s.mask
    : (console.log(s), s.mask);
}
var B = class {
    constructor(e, t) {
      this.stickerings = new Map();
      for (let [r, i] of Object.entries(e.definition.orbits))
        this.stickerings.set(r, new Array(i.numPieces).fill(t));
    }
  },
  E = "regular",
  g = "ignored",
  $ = "oriented",
  Ce = "invisible",
  A = "dim",
  pn = {
    Regular: { facelets: [E, E, E, E, E] },
    Ignored: { facelets: [g, g, g, g, g] },
    OrientationStickers: { facelets: [$, $, $, $, $] },
    IgnoreNonPrimary: { facelets: [E, g, g, g, g] },
    Invisible: { facelets: [Ce, Ce, Ce, Ce] },
    PermuteNonPrimary: { facelets: [A, E, E, E, E] },
    Dim: { facelets: [A, A, A, A, A] },
    Ignoriented: { facelets: [A, g, g, g, g] },
    OrientationWithoutPermutation: { facelets: [$, g, g, g, g] },
  };
function vn(e) {
  return pn[e];
}
var $e = class extends B {
    constructor(e) {
      super(e, "Regular");
    }
    set(e, t) {
      for (let [r, i] of this.stickerings.entries())
        for (let n = 0; n < i.length; n++)
          e.stickerings.get(r)[n] && (i[n] = t);
      return this;
    }
    toStickeringMask() {
      let e = { orbits: {} };
      for (let [t, r] of this.stickerings.entries()) {
        let i = [],
          n = { pieces: i };
        e.orbits[t] = n;
        for (let a of r) i.push(vn(a));
      }
      return e;
    }
  },
  Je = class {
    constructor(e) {
      this.kpuzzle = e;
    }
    and(e) {
      let t = new B(this.kpuzzle, !1);
      for (let [r, i] of Object.entries(this.kpuzzle.definition.orbits))
        e: for (let n = 0; n < i.numPieces; n++) {
          t.stickerings.get(r)[n] = !0;
          for (let a of e)
            if (!a.stickerings.get(r)[n]) {
              t.stickerings.get(r)[n] = !1;
              continue e;
            }
        }
      return t;
    }
    or(e) {
      let t = new B(this.kpuzzle, !1);
      for (let [r, i] of Object.entries(this.kpuzzle.definition.orbits))
        e: for (let n = 0; n < i.numPieces; n++) {
          t.stickerings.get(r)[n] = !1;
          for (let a of e)
            if (a.stickerings.get(r)[n]) {
              t.stickerings.get(r)[n] = !0;
              continue e;
            }
        }
      return t;
    }
    not(e) {
      let t = new B(this.kpuzzle, !1);
      for (let [r, i] of Object.entries(this.kpuzzle.definition.orbits))
        for (let n = 0; n < i.numPieces; n++)
          t.stickerings.get(r)[n] = !e.stickerings.get(r)[n];
      return t;
    }
    all() {
      return this.and(this.moves([]));
    }
    move(e) {
      let t = this.kpuzzle.moveToTransformation(e),
        r = new B(this.kpuzzle, !1);
      for (let [i, n] of Object.entries(this.kpuzzle.definition.orbits))
        for (let a = 0; a < n.numPieces; a++)
          (t.transformationData[i].permutation[a] !== a ||
            t.transformationData[i].orientation[a] !== 0) &&
            (r.stickerings.get(i)[a] = !0);
      return r;
    }
    moves(e) {
      return e.map((t) => this.move(t));
    }
    orbits(e) {
      let t = new B(this.kpuzzle, !1);
      for (let r of e) t.stickerings.get(r).fill(!0);
      return t;
    }
    orbitPrefix(e) {
      let t = new B(this.kpuzzle, !1);
      for (let r in this.kpuzzle.definition.orbits)
        r.startsWith(e) && t.stickerings.get(r).fill(!0);
      return t;
    }
  },
  xn = {
    full: { groups: { "3x3x3": "Stickering" } },
    OLL: { groups: { "3x3x3": "Last Layer" } },
    PLL: { groups: { "3x3x3": "Last Layer" } },
    LL: { groups: { "3x3x3": "Last Layer" } },
    EOLL: { groups: { "3x3x3": "Last Layer" } },
    COLL: { groups: { "3x3x3": "Last Layer" } },
    OCLL: { groups: { "3x3x3": "Last Layer" } },
    CLL: { groups: { "3x3x3": "Last Layer" } },
    ELL: { groups: { "3x3x3": "Last Layer" } },
    ZBLL: { groups: { "3x3x3": "Last Layer" } },
    LS: { groups: { "3x3x3": "Last Slot" } },
    ELS: { groups: { "3x3x3": "Last Slot" } },
    CLS: { groups: { "3x3x3": "Last Slot" } },
    ZBLS: { groups: { "3x3x3": "Last Slot" } },
    VLS: { groups: { "3x3x3": "Last Slot" } },
    WVLS: { groups: { "3x3x3": "Last Slot" } },
    F2L: { groups: { "3x3x3": "CFOP (Fridrich)" } },
    Daisy: { groups: { "3x3x3": "CFOP (Fridrich)" } },
    Cross: { groups: { "3x3x3": "CFOP (Fridrich)" } },
    EO: { groups: { "3x3x3": "ZZ" } },
    EOline: { groups: { "3x3x3": "ZZ" } },
    EOcross: { groups: { "3x3x3": "ZZ" } },
    CMLL: { groups: { "3x3x3": "Roux" } },
    L10P: { groups: { "3x3x3": "Roux" } },
    L6E: { groups: { "3x3x3": "Roux" } },
    L6EO: { groups: { "3x3x3": "Roux" } },
    "2x2x2": { groups: { "3x3x3": "Petrus" } },
    "2x2x3": { groups: { "3x3x3": "Petrus" } },
    "Void Cube": { groups: { "3x3x3": "Miscellaneous" } },
    invisible: { groups: { "3x3x3": "Miscellaneous" } },
    picture: { groups: { "3x3x3": "Miscellaneous" } },
    "centers-only": { groups: { "3x3x3": "Miscellaneous" } },
    "experimental-centers-U": {},
    "experimental-centers-U-D": {},
    "experimental-centers-U-L-D": {},
    "experimental-centers-U-L-B-D": {},
    "experimental-centers": {},
    "experimental-fto-fc": { groups: { fto: "Bencisco" } },
    "experimental-fto-f2t": { groups: { fto: "Bencisco" } },
    "experimental-fto-sc": { groups: { fto: "Bencisco" } },
    "experimental-fto-l2c": { groups: { fto: "Bencisco" } },
    "experimental-fto-lbt": { groups: { fto: "Bencisco" } },
    "experimental-fto-l3t": { groups: { fto: "Bencisco" } },
  };
async function J(e, t) {
  let r = await e.kpuzzle(),
    i = new $e(r),
    n = new Je(r),
    a = () => n.move("U"),
    o = () => n.or(n.moves(["U", "D"])),
    s = () => n.or(n.moves(["L", "R"])),
    m = () => n.not(s()),
    h = () => n.not(a()),
    d = () => n.orbitPrefix("CENTER"),
    S = () => n.orbitPrefix("EDGE"),
    f = () =>
      n.or([
        n.orbitPrefix("CORNER"),
        n.orbitPrefix("C4RNER"),
        n.orbitPrefix("C5RNER"),
      ]),
    z = () => n.or([m(), n.and([a(), S()])]),
    p = () => n.and([a(), d()]),
    R = () => n.and([n.and(n.moves(["F", "R"])), S()]),
    We = () => n.and([n.and(n.moves(["F", "R"])), f(), n.not(a())]),
    Re = () => n.or([We(), R()]);
  function y() {
    i.set(h(), "Dim");
  }
  function an() {
    i.set(a(), "PermuteNonPrimary"), i.set(p(), "Dim");
  }
  function de() {
    i.set(a(), "IgnoreNonPrimary"), i.set(p(), "Regular");
  }
  function sn() {
    i.set(a(), "Ignoriented"), i.set(p(), "Dim");
  }
  switch (t) {
    case "full":
      break;
    case "PLL": {
      y(), an();
      break;
    }
    case "CLS": {
      y(),
        i.set(We(), "Regular"),
        i.set(a(), "Ignoriented"),
        i.set(n.and([a(), d()]), "Dim"),
        i.set(n.and([a(), f()]), "IgnoreNonPrimary");
      break;
    }
    case "OLL": {
      y(), de();
      break;
    }
    case "EOLL": {
      y(), de(), i.set(n.and([a(), f()]), "Ignored");
      break;
    }
    case "COLL": {
      y(),
        i.set(n.and([a(), S()]), "Ignoriented"),
        i.set(n.and([a(), d()]), "Dim"),
        i.set(n.and([a(), f()]), "Regular");
      break;
    }
    case "OCLL": {
      y(), sn(), i.set(n.and([a(), f()]), "IgnoreNonPrimary");
      break;
    }
    case "CLL": {
      y(), i.set(n.not(n.and([f(), a()])), "Dim");
      break;
    }
    case "ELL": {
      y(), i.set(a(), "Dim"), i.set(n.and([a(), S()]), "Regular");
      break;
    }
    case "ELS": {
      y(),
        de(),
        i.set(n.and([a(), f()]), "Ignored"),
        i.set(R(), "Regular"),
        i.set(We(), "Ignored");
      break;
    }
    case "LL": {
      y();
      break;
    }
    case "F2L": {
      i.set(a(), "Ignored");
      break;
    }
    case "ZBLL": {
      y(),
        i.set(a(), "PermuteNonPrimary"),
        i.set(p(), "Dim"),
        i.set(n.and([a(), f()]), "Regular");
      break;
    }
    case "ZBLS": {
      y(), i.set(Re(), "Regular"), de(), i.set(n.and([a(), f()]), "Ignored");
      break;
    }
    case "VLS": {
      y(), i.set(Re(), "Regular"), de();
      break;
    }
    case "WVLS": {
      y(),
        i.set(Re(), "Regular"),
        i.set(n.and([a(), S()]), "Ignoriented"),
        i.set(n.and([a(), d()]), "Dim"),
        i.set(n.and([a(), f()]), "IgnoreNonPrimary");
      break;
    }
    case "LS": {
      y(), i.set(Re(), "Regular"), i.set(a(), "Ignored"), i.set(p(), "Dim");
      break;
    }
    case "EO": {
      i.set(f(), "Ignored"), i.set(S(), "OrientationWithoutPermutation");
      break;
    }
    case "EOline": {
      i.set(f(), "Ignored"),
        i.set(S(), "OrientationWithoutPermutation"),
        i.set(n.and(n.moves(["D", "M"])), "Regular");
      break;
    }
    case "EOcross": {
      i.set(S(), "OrientationWithoutPermutation"),
        i.set(n.move("D"), "Regular"),
        i.set(f(), "Ignored");
      break;
    }
    case "CMLL": {
      i.set(h(), "Dim"),
        i.set(z(), "Ignored"),
        i.set(n.and([a(), f()]), "Regular");
      break;
    }
    case "L10P": {
      i.set(n.not(z()), "Dim"), i.set(n.and([f(), a()]), "Regular");
      break;
    }
    case "L6E": {
      i.set(n.not(z()), "Dim");
      break;
    }
    case "L6EO": {
      i.set(n.not(z()), "Dim"),
        i.set(z(), "OrientationWithoutPermutation"),
        i.set(n.and([d(), o()]), "OrientationStickers");
      break;
    }
    case "Daisy": {
      i.set(n.all(), "Ignored"),
        i.set(d(), "Dim"),
        i.set(n.and([n.move("D"), d()]), "Regular"),
        i.set(n.and([n.move("U"), S()]), "IgnoreNonPrimary");
      break;
    }
    case "Cross": {
      i.set(n.all(), "Ignored"),
        i.set(d(), "Dim"),
        i.set(n.and([n.move("D"), d()]), "Regular"),
        i.set(n.and([n.move("D"), S()]), "Regular");
      break;
    }
    case "2x2x2": {
      i.set(n.or(n.moves(["U", "F", "R"])), "Ignored"),
        i.set(n.and([n.or(n.moves(["U", "F", "R"])), d()]), "Dim");
      break;
    }
    case "2x2x3": {
      i.set(n.all(), "Dim"),
        i.set(n.or(n.moves(["U", "F", "R"])), "Ignored"),
        i.set(n.and([n.or(n.moves(["U", "F", "R"])), d()]), "Dim"),
        i.set(
          n.and([n.move("F"), n.not(n.or(n.moves(["U", "R"])))]),
          "Regular"
        );
      break;
    }
    case "Void Cube": {
      i.set(d(), "Invisible");
      break;
    }
    case "picture":
    case "invisible": {
      i.set(n.all(), "Invisible");
      break;
    }
    case "centers-only": {
      i.set(n.not(d()), "Ignored");
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${e.id}: ${t}. Setting all pieces to dim.`
      ),
        i.set(n.and(n.moves([])), "Dim");
  }
  return i.toStickeringMask();
}
async function Oe() {
  let e = [];
  for (let [t, r] of Object.entries(xn))
    r.groups && "3x3x3" in r.groups && e.push(t);
  return e;
}
function v(e) {
  let t = null;
  return () => t ?? (t = e());
}
var fe = class extends Promise {
  constructor(e) {
    super((t) => {
      t();
    }),
      (this._executor = e);
  }
  static from(e) {
    return new fe((t) => {
      t(e());
    });
  }
  static resolve(e) {
    return new fe((t) => {
      t(e);
    });
  }
  static reject(e) {
    return new fe((t, r) => {
      r(e);
    });
  }
  then(e, t) {
    return (
      (this._promise = this._promise || new Promise(this._executor)),
      this._promise.then(e, t)
    );
  }
  catch(e) {
    return (
      (this._promise = this._promise || new Promise(this._executor)),
      this._promise.catch(e)
    );
  }
};
function Ze(e) {
  return new fe((t) => {
    t(e());
  });
}
async function ge(e) {
  return (
    await import("./puzzle-geometry-LRWVA7LC.js")
  ).getPuzzleGeometryByName(e, {
    allMoves: !0,
    orientCenters: !0,
    addRotations: !0,
  });
}
async function gn(e, t) {
  let r = await e,
    i = r.getKPuzzleDefinition(!0);
  i.name = t;
  let n = await import("./puzzle-geometry-LRWVA7LC.js"),
    a = new n.ExperimentalPGNotation(r, r.getOrbitsDef(!0));
  return new k(i, { experimentalPGNotation: a });
}
var pe,
  ve,
  xe,
  yt,
  I =
    ((yt = class {
      constructor(e) {
        u(this, pe, void 0);
        u(this, ve, void 0);
        u(this, xe, void 0);
        (this.puzzleSpecificSimplifyOptionsPromise = bt(
          this.kpuzzle.bind(this)
        )),
          (this.pgId = e.pgID),
          (this.id = e.id),
          (this.fullName = e.fullName),
          (this.inventedBy = e.inventedBy),
          (this.inventionYear = e.inventionYear);
      }
      pg() {
        return c(this, pe) ?? l(this, pe, ge(this.pgId ?? this.id));
      }
      kpuzzle() {
        return c(this, ve) ?? l(this, ve, gn(this.pg(), this.id));
      }
      svg() {
        return (
          c(this, xe) ??
          l(this, xe, (async () => (await this.pg()).generatesvg())())
        );
      }
    }),
    (pe = new WeakMap()),
    (ve = new WeakMap()),
    (xe = new WeakMap()),
    yt),
  Z = class extends I {
    constructor() {
      super(...arguments), (this.stickerings = Oe);
    }
    stickeringMask(e) {
      return J(this, e);
    }
  };
function bt(e) {
  return new fe(async (t) => {
    let r = await e();
    console.log(r),
      t({
        quantumMoveOrder: (i) =>
          r.moveToTransformation(new T(i)).repetitionOrder(),
      });
  });
}
var Qe = {
  name: "3x3x3",
  orbits: {
    EDGES: { numPieces: 12, numOrientations: 2 },
    CORNERS: { numPieces: 8, numOrientations: 3 },
    CENTERS: { numPieces: 6, numOrientations: 4 },
  },
  startStateData: {
    EDGES: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    CORNERS: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    CENTERS: { pieces: [0, 1, 2, 3, 4, 5], orientation: [0, 0, 0, 0, 0, 0] },
  },
  moves: {
    U: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [1, 0, 0, 0, 0, 0],
      },
    },
    y: {
      EDGES: {
        permutation: [1, 2, 3, 0, 5, 6, 7, 4, 10, 8, 11, 9],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 7, 4, 5, 6],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientation: [1, 0, 0, 0, 0, 3],
      },
    },
    x: {
      EDGES: {
        permutation: [4, 8, 0, 9, 6, 10, 2, 11, 5, 7, 1, 3],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [4, 0, 3, 5, 7, 6, 2, 1],
        orientation: [2, 1, 2, 1, 1, 2, 1, 2],
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientation: [0, 3, 0, 1, 2, 2],
      },
    },
    L: {
      EDGES: {
        permutation: [0, 1, 2, 11, 4, 5, 6, 9, 8, 3, 10, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientation: [0, 0, 2, 1, 0, 2, 1, 0],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 1, 0, 0, 0, 0],
      },
    },
    F: {
      EDGES: {
        permutation: [9, 1, 2, 3, 8, 5, 6, 7, 0, 4, 10, 11],
        orientation: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientation: [1, 0, 0, 2, 2, 1, 0, 0],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 1, 0, 0, 0],
      },
    },
    R: {
      EDGES: {
        permutation: [0, 8, 2, 3, 4, 10, 6, 7, 5, 9, 1, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientation: [2, 1, 0, 0, 1, 0, 0, 2],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 1, 0, 0],
      },
    },
    B: {
      EDGES: {
        permutation: [0, 1, 10, 3, 4, 5, 11, 7, 8, 9, 6, 2],
        orientation: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientation: [0, 2, 1, 0, 0, 0, 2, 1],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 1, 0],
      },
    },
    D: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 0, 1],
      },
    },
    z: {
      EDGES: {
        permutation: [9, 3, 11, 7, 8, 1, 10, 5, 0, 4, 2, 6],
        orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      },
      CORNERS: {
        permutation: [3, 2, 6, 5, 0, 4, 7, 1],
        orientation: [1, 2, 1, 2, 2, 1, 2, 1],
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 1, 1, 3, 1],
      },
    },
    M: {
      EDGES: {
        permutation: [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientation: [2, 0, 0, 0, 2, 0],
      },
    },
    E: {
      EDGES: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 8, 10],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientation: [0, 0, 0, 0, 0, 0],
      },
    },
    S: {
      EDGES: {
        permutation: [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11],
        orientation: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 0, 1, 0, 1],
      },
    },
    u: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 10, 8, 11, 9],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientation: [1, 0, 0, 0, 0, 0],
      },
    },
    l: {
      EDGES: {
        permutation: [2, 1, 6, 11, 0, 5, 4, 9, 8, 3, 10, 7],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientation: [0, 0, 2, 1, 0, 2, 1, 0],
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientation: [2, 1, 0, 0, 2, 0],
      },
    },
    f: {
      EDGES: {
        permutation: [9, 3, 2, 7, 8, 1, 6, 5, 0, 4, 10, 11],
        orientation: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientation: [1, 0, 0, 2, 2, 1, 0, 0],
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 1, 1, 0, 1],
      },
    },
    r: {
      EDGES: {
        permutation: [4, 8, 0, 3, 6, 10, 2, 7, 5, 9, 1, 11],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientation: [2, 1, 0, 0, 1, 0, 0, 2],
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientation: [0, 0, 0, 1, 2, 2],
      },
    },
    b: {
      EDGES: {
        permutation: [0, 5, 10, 1, 4, 7, 11, 3, 8, 9, 6, 2],
        orientation: [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientation: [0, 2, 1, 0, 0, 0, 2, 1],
      },
      CENTERS: {
        permutation: [3, 0, 2, 5, 4, 1],
        orientation: [3, 3, 0, 3, 1, 3],
      },
    },
    d: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 9, 11, 8, 10],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientation: [0, 0, 0, 0, 0, 1],
      },
    },
  },
};
Qe.experimentalDerivedMoves = {
  Uw: "u",
  Lw: "l",
  Fw: "f",
  Rw: "r",
  Bw: "b",
  Dw: "d",
  Uv: "y",
  Lv: "x'",
  Fv: "z",
  Rv: "x",
  Bv: "z'",
  Dv: "y'",
  "2U": "u U'",
  "2L": "l L'",
  "2F": "f F'",
  "2R": "r R'",
  "2B": "b B'",
  "2D": "d D'",
};
async function Di(e) {
  let t = await (e.puzzleSpecificSimplifyOptions ??
    e.puzzleSpecificSimplifyOptionsPromise);
  return t ? { puzzleLoader: { puzzleSpecificSimplifyOptions: t } } : {};
}
async function Xe(e) {
  return (
    await import("./puzzle-geometry-LRWVA7LC.js")
  ).getPuzzleGeometryByDesc(e, {
    allMoves: !0,
    orientCenters: !0,
    addRotations: !0,
  });
}
async function Sn(e) {
  let t = await Xe(e),
    r = t.getKPuzzleDefinition(!0);
  r.name = `description: ${e}`;
  let i = await import("./puzzle-geometry-LRWVA7LC.js"),
    n = new i.ExperimentalPGNotation(t, t.getOrbitsDef(!0));
  return new k(r, { experimentalPGNotation: n });
}
var wn = 1;
function Ei(e, t) {
  let r = wn++,
    i = null,
    n = async () => i ?? (i = Sn(e)),
    a = {
      id: `custom-${r}`,
      fullName: t?.fullName ?? `Custom Puzzle (instance #${r})`,
      kpuzzle: n,
      svg: async () => (await Xe(e)).generatesvg(),
      pg: async () => Xe(e),
      puzzleSpecificSimplifyOptionsPromise: bt(n),
    };
  return (
    t?.inventedBy && (a.inventedBy = t.inventedBy),
    t?.inventionYear && (a.inventionYear = t.inventionYear),
    a
  );
}
var et = new k(Qe);
Qe.experimentalIsStateSolved = Dn;
function zt(e) {
  let t = e.stateData.CENTERS.pieces[0],
    r = e.stateData.CENTERS.pieces[5],
    i = e.stateData.CENTERS.pieces[1],
    n = i;
  return t < i && n--, r < i && n--, [t, n];
}
var wt = new Array(6).fill(0).map(() => new Array(6)),
  yn = !1;
function bn() {
  if (!yn) {
    let e = ["", "z", "x", "z'", "x'", "x2"].map((r) => q.fromString(r)),
      t = new q("y");
    for (let r of e) {
      let i = et.algToTransformation(r);
      for (let n = 0; n < 4; n++) {
        i = i.applyAlg(t);
        let [a, o] = zt(i.toKState());
        wt[a][o] = i.invert();
      }
    }
  }
  return wt;
}
function zn(e) {
  let [t, r] = zt(e),
    i = bn()[t][r];
  return e.applyTransformation(i);
}
function Dn(e, t) {
  return (
    t.ignorePuzzleOrientation && (e = zn(e)),
    t.ignoreCenterOrientation &&
      (e = new G(e.kpuzzle, {
        EDGES: e.stateData.EDGES,
        CORNERS: e.stateData.CORNERS,
        CENTERS: {
          pieces: e.stateData.CENTERS.pieces,
          orientation: new Array(6).fill(0),
        },
      })),
    !!e.experimentalToTransformation()?.isIdentityTransformation()
  );
}
var En = {
  333: { puzzleID: "3x3x3", eventName: "3x3x3 Cube" },
  222: { puzzleID: "2x2x2", eventName: "2x2x2 Cube" },
  444: { puzzleID: "4x4x4", eventName: "4x4x4 Cube" },
  555: { puzzleID: "5x5x5", eventName: "5x5x5 Cube" },
  666: { puzzleID: "6x6x6", eventName: "6x6x6 Cube" },
  777: { puzzleID: "7x7x7", eventName: "7x7x7 Cube" },
  "333bf": { puzzleID: "3x3x3", eventName: "3x3x3 Blindfolded" },
  "333fm": { puzzleID: "3x3x3", eventName: "3x3x3 Fewest Moves" },
  "333oh": { puzzleID: "3x3x3", eventName: "3x3x3 One-Handed" },
  clock: { puzzleID: "clock", eventName: "Clock" },
  minx: { puzzleID: "megaminx", eventName: "Megaminx" },
  pyram: { puzzleID: "pyraminx", eventName: "Pyraminx" },
  skewb: { puzzleID: "skewb", eventName: "Skewb" },
  sq1: { puzzleID: "square1", eventName: "Square-1" },
  "444bf": { puzzleID: "4x4x4", eventName: "4x4x4 Blindfolded" },
  "555bf": { puzzleID: "5x5x5", eventName: "5x5x5 Blindfolded" },
  "333mb": { puzzleID: "3x3x3", eventName: "3x3x3 Multi-Blind" },
};
var kn = {
  ...En,
  fto: { puzzleID: "fto", eventName: "Face-Turning Octahedron" },
  master_tetraminx: {
    puzzleID: "master_tetraminx",
    eventName: "Master Tetraminx",
  },
  kilominx: { puzzleID: "kilominx", eventName: "Kilominx" },
  redi_cube: { puzzleID: "redi_cube", eventName: "Redi Cube" },
};
function Gi(e) {
  return kn[e] ?? null;
}
var kt = {
  id: "2x2x2",
  fullName: "2\xD72\xD72 Cube",
  kpuzzle: v(
    async () =>
      new k(
        (
          await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js")
        ).cube2x2x2JSON
      )
  ),
  svg: async () =>
    (await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js"))
      .cube2x2x2SVG,
  pg: v(async () => ge("2x2x2")),
  stickeringMask: (e) => J(kt, e),
  stickerings: Oe,
};
function x(e, t, r, i) {
  let n = [];
  for (let a of e) {
    let o = T.fromString(a),
      { family: s, amount: m } = o;
    if (![-1, 1].includes(m)) throw new Error("Invalid config move");
    n.push({ family: s, direction: m, type: t, from: r, to: i });
  }
  return n;
}
var _ = {
    "x axis": {
      sliceDiameter: 3,
      extendsThroughEntirePuzzle: !0,
      moveSourceInfos: [
        ...x(["R"], 0, 0, 3),
        ...x(["L'"], 1, 0, 3),
        ...x(["r", "Rw"], 2, 0, 2),
        ...x(["l'", "Lw'"], 3, 0, 2),
        ...x(["M'"], 4, 1, 2),
        ...x(["x", "Uv", "Dv'"], 5, 0, 3),
      ],
    },
    "y axis": {
      sliceDiameter: 3,
      extendsThroughEntirePuzzle: !0,
      moveSourceInfos: [
        ...x(["U"], 0, 0, 3),
        ...x(["D'"], 1, 0, 3),
        ...x(["u", "Uw"], 2, 0, 2),
        ...x(["d'", "Dw'"], 3, 0, 2),
        ...x(["E'"], 4, 1, 2),
        ...x(["y", "Uv", "Dv'"], 5, 0, 3),
      ],
    },
    "z axis": {
      sliceDiameter: 3,
      extendsThroughEntirePuzzle: !0,
      moveSourceInfos: [
        ...x(["F"], 0, 0, 3),
        ...x(["B'"], 1, 0, 3),
        ...x(["f", "Fw"], 2, 0, 3),
        ...x(["b'", "Bw'"], 3, 0, 3),
        ...x(["S"], 4, 1, 2),
        ...x(["z", "Fv", "Bv'"], 5, 0, 3),
      ],
    },
  },
  Se = {};
for (let [e, t] of Object.entries(_))
  for (let r of t.moveSourceInfos)
    Se[r.family] = { axis: e, moveSourceInfo: r };
var Tt = {},
  Dt;
for (let e of Object.keys(_)) {
  let t = {};
  Tt[e] = t;
  for (let r of _[e].moveSourceInfos)
    (t[(Dt = r.type)] ?? (t[Dt] = [])).push(r);
}
var Lt = {};
for (let e of Object.keys(_)) {
  let t = new Map();
  Lt[e] = t;
  for (let r of _[e].moveSourceInfos) t.get(r.from) || t.set(r.from, r);
}
function Et(e, t) {
  let r = Tt[e][t]?.[0];
  if (!r)
    throw new Error(
      `Could not find a reference move (axis: ${e}, move source type: ${t})`
    );
  return r;
}
var Tn = (e, t) => Se[e.family].axis === Se[t.family].axis;
function Ln(e, t, r, i) {
  if (t + 1 === r) {
    let f = Lt[e].get(t);
    if (f) return new T(new Pe(f.family), i * f.direction);
  }
  let n = _[e],
    { sliceDiameter: a } = n;
  if (t === 0 && r === a) {
    let f = Et(e, 5);
    return new T(new Pe(f.family), i * f.direction);
  }
  let o = t + r > a;
  o && ([t, r] = [a - r, a - t]);
  let s = t + 1,
    m = r,
    h = s === m;
  h && (m = null),
    s === 1 && (s = null),
    h && s === 1 && (m = null),
    !h && m === 2 && (m = null);
  let S = Et(e, h ? (o ? 1 : 0) : o ? 3 : 2);
  return new T(new Pe(S.family, m, s), i * S.direction);
}
function Rn(e, t = !0) {
  if (e.length === 0) return [];
  let r = Se[e[0].family].axis,
    i = _[r],
    { sliceDiameter: n } = i,
    a = new Map(),
    o = null;
  function s(f, z) {
    let p = (a.get(f) ?? 0) + z;
    t && (p = (p % 4) + (5 % 4) - 1), p === 0 ? a.delete(f) : a.set(f, p);
  }
  let m = 0;
  for (let f of Array.from(e).reverse()) {
    m++;
    let { moveSourceInfo: z } = Se[f.family],
      p = f.amount * z.direction;
    switch (z.type) {
      case 0: {
        let R = (f.innerLayer ?? 1) - 1;
        s(R, p), s(R + 1, -p);
        break;
      }
      case 1: {
        let R = n - (f.innerLayer ?? 1);
        s(R, p), s(R + 1, -p);
        break;
      }
      case 2: {
        s((f.outerLayer ?? 1) - 1, p), s(f.innerLayer ?? 2, -p);
        break;
      }
      case 3: {
        s(n - (f.innerLayer ?? 2), p), s(n - ((f.outerLayer ?? 1) - 1), -p);
        break;
      }
      case 4: {
        s(z.from, p), s(z.to, -p);
        break;
      }
      case 5: {
        s(0, p), s(n, -p);
        break;
      }
    }
    [0, 2].includes(a.size) &&
      (o = { suffixLength: m, sliceDeltas: new Map(a) });
  }
  if (a.size === 0) return [];
  if (!o) return e;
  let [h, d] = o.sliceDeltas.keys();
  h > d && ([h, d] = [d, h]);
  let S = o.sliceDeltas.get(h);
  return [...e.slice(0, -o.suffixLength), ...(S !== 0 ? [Ln(r, h, d, S)] : [])];
}
var Pn = {
    quantumMoveOrder: () => 4,
    axis: { areQuantumMovesSameAxis: Tn, simplifySameAxisMoves: Rn },
  },
  Rt = {
    id: "3x3x3",
    fullName: "3\xD73\xD73 Cube",
    inventedBy: ["Ern\u0151 Rubik"],
    inventionYear: 1974,
    kpuzzle: v(async () => et),
    svg: v(
      async () =>
        (await import("./puzzles-dynamic-3x3x3-QN5DUJUA-LUB5BYWK.js"))
          .cube3x3x3SVG
    ),
    llSVG: v(
      async () =>
        (await import("./puzzles-dynamic-3x3x3-QN5DUJUA-LUB5BYWK.js"))
          .cube3x3x3LLSVG
    ),
    pg: v(async () => ge("3x3x3")),
    stickeringMask: (e) => J(Rt, e),
    stickerings: Oe,
    puzzleSpecificSimplifyOptions: Pn,
  },
  In = {
    id: "clock",
    fullName: "Clock",
    inventedBy: ["Christopher C. Wiggs", "Christopher J. Taylor"],
    inventionYear: 1988,
    kpuzzle: v(
      async () =>
        new k(
          (
            await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js")
          ).clockJSON
        )
    ),
    svg: v(
      async () =>
        (await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js"))
          .clockSVG
    ),
  };
async function Cn(e, t) {
  let r = await e.kpuzzle(),
    i = new $e(r),
    n = new Je(r),
    a = () => n.and([n.move("U"), n.not(n.or(n.moves(["F", "BL", "BR"])))]),
    o = () => n.and([n.move("U"), n.not(n.move("F"))]),
    s = () =>
      n.or([
        o(),
        n.and([n.move("F"), n.not(n.or(n.moves(["U", "BL", "BR"])))]),
      ]),
    m = () =>
      n.not(
        n.or([
          n.and([n.move("U"), n.move("F")]),
          n.and([n.move("F"), n.move("BL")]),
          n.and([n.move("F"), n.move("BR")]),
          n.and([n.move("BL"), n.move("BR")]),
        ])
      ),
    h = () =>
      n.not(
        n.or([
          n.and([n.move("F"), n.move("BL")]),
          n.and([n.move("F"), n.move("BR")]),
          n.and([n.move("BL"), n.move("BR")]),
        ])
      );
  switch (t) {
    case "full":
      break;
    case "experimental-fto-fc": {
      i.set(n.not(a()), "Ignored");
      break;
    }
    case "experimental-fto-f2t": {
      i.set(n.not(o()), "Ignored"), i.set(a(), "Dim");
      break;
    }
    case "experimental-fto-sc": {
      i.set(n.not(s()), "Ignored"), i.set(o(), "Dim");
      break;
    }
    case "experimental-fto-l2c": {
      i.set(n.not(m()), "Ignored"), i.set(s(), "Dim");
      break;
    }
    case "experimental-fto-lbt": {
      i.set(n.not(h()), "Ignored"), i.set(m(), "Dim");
      break;
    }
    case "experimental-fto-l3t": {
      i.set(h(), "Dim");
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${e.id}: ${t}. Setting all pieces to dim.`
      ),
        i.set(n.and(n.moves([])), "Dim");
  }
  return i.toStickeringMask();
}
async function On() {
  return [
    "full",
    "experimental-fto-fc",
    "experimental-fto-f2t",
    "experimental-fto-sc",
    "experimental-fto-l2c",
    "experimental-fto-lbt",
    "experimental-fto-l3t",
  ];
}
var Nn = class extends I {
    constructor() {
      super({
        pgID: "FTO",
        id: "fto",
        fullName: "Face-Turning Octahedron",
        inventedBy: ["Karl Rohrbach", "David Pitcher"],
        inventionYear: 1983,
      }),
        (this.stickerings = On),
        (this.svg = v(
          async () =>
            (await import("./puzzles-dynamic-unofficial-QXSDLTK5-B722FFJC.js"))
              .ftoSVG
        ));
    }
    stickeringMask(e) {
      return Cn(this, e);
    }
  },
  Mn = new Nn();
async function Fn(e, t) {
  switch ((console.log(e, t), t)) {
    case "full":
    case "F2L":
    case "LL":
    case "OLL":
    case "EOLL":
    case "OCLL":
    case "PLL":
    case "ELS":
    case "CLS":
      return J(e, t);
    default:
      console.warn(
        `Unsupported stickering for ${e.id}: ${t}. Setting all pieces to dim.`
      );
  }
  return J(e, "full");
}
async function Gn() {
  return ["full", "F2L", "LL", "OLL", "EOLL", "OCLL", "PLL", "ELS", "CLS"];
}
var An = class extends I {
    constructor() {
      super({ id: "megaminx", fullName: "Megaminx", inventionYear: 1981 }),
        (this.stickerings = Gn);
    }
    stickeringMask(e) {
      return Fn(this, e);
    }
  },
  Bn = new An(),
  _n = class extends I {
    constructor() {
      super({
        id: "pyraminx",
        fullName: "Pyraminx",
        inventedBy: ["Uwe Meffert"],
      }),
        (this.svg = v(
          async () =>
            (await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js"))
              .pyraminxSVG
        ));
    }
  },
  Un = new _n(),
  Vn = {
    id: "square1",
    fullName: "Square-1",
    inventedBy: ["Karel Hr\u0161el", "Vojtech Kopsk\xFD"],
    inventionYear: 1990,
    kpuzzle: v(
      async () =>
        new k(
          (
            await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js")
          ).sq1HyperOrbitJSON
        )
    ),
    svg: v(
      async () =>
        (await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js"))
          .sq1HyperOrbitSVG
    ),
  },
  Yn = {
    id: "kilominx",
    fullName: "Kilominx",
    kpuzzle: v(async () => {
      let e = await ge("megaminx + chopasaurus"),
        t = JSON.parse(JSON.stringify(e.getKPuzzleDefinition(!0)));
      delete t.orbits.CENTERS,
        delete t.orbits.CENTERS2,
        delete t.startStateData.CENTERS,
        delete t.startStateData.CENTERS2;
      for (let o of Object.values(t.moves)) delete o.CENTERS, delete o.CENTERS2;
      (t.name = "kilominx"), delete t.experimentalPuzzleDescription;
      let r = await import("./puzzle-geometry-LRWVA7LC.js"),
        i = new r.ExperimentalPGNotation(e, e.getOrbitsDef(!0)),
        n = new k(t, {
          experimentalPGNotation: {
            lookupMove: (o) =>
              o.toString() === "x2" || o.toString() === "x2'"
                ? a.transformationData
                : i.lookupMove(o),
          },
        }),
        a = n.algToTransformation("Rv2 Fv Uv'");
      return (t.moves.x2 = a), n;
    }),
    svg: v(
      async () =>
        (await import("./puzzles-dynamic-unofficial-QXSDLTK5-B722FFJC.js"))
          .kilominxSVG
    ),
  },
  Kn = {
    id: "redi_cube",
    fullName: "Redi Cube",
    inventedBy: ["Oskar van Deventer"],
    inventionYear: 2009,
    kpuzzle: v(
      async () =>
        new k(
          (
            await import("./puzzles-dynamic-unofficial-QXSDLTK5-B722FFJC.js")
          ).rediCubeJSON
        )
    ),
    svg: async () =>
      (await import("./puzzles-dynamic-unofficial-QXSDLTK5-B722FFJC.js"))
        .rediCubeSVG,
  },
  Pt = new Z({ id: "4x4x4", fullName: "4\xD74\xD74 Cube" });
Pt.llSVG = v(
  async () =>
    (await import("./puzzles-dynamic-4x4x4-DT42HVIY-YJ72NI54.js"))
      .cube4x4x4LLSVG
);
var Hn = {
    id: "melindas2x2x2x2",
    fullName: "Melinda's 2\xD72\xD72\xD72",
    inventedBy: ["Melinda Green"],
    kpuzzle: v(
      async () =>
        new k(
          (
            await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js")
          ).melindas2x2x2x2OrbitJSON
        )
    ),
    svg: v(
      async () =>
        (await import("./puzzles-dynamic-side-events-S25NGSZR-V75ZYFJ2.js"))
          .melindas2x2x2x2OrbitSVG
    ),
  },
  Ai = {
    "3x3x3": Rt,
    "2x2x2": kt,
    "4x4x4": Pt,
    "5x5x5": new Z({ id: "5x5x5", fullName: "5\xD75\xD75 Cube" }),
    "6x6x6": new Z({ id: "6x6x6", fullName: "6\xD76\xD76 Cube" }),
    "7x7x7": new Z({ id: "7x7x7", fullName: "7\xD77\xD77 Cube" }),
    "40x40x40": new Z({ id: "40x40x40", fullName: "40\xD740\xD740 Cube" }),
    clock: In,
    megaminx: Bn,
    pyraminx: Un,
    skewb: new I({
      id: "skewb",
      fullName: "Skewb",
      inventedBy: ["Tony Durham"],
    }),
    square1: Vn,
    fto: Mn,
    gigaminx: new I({
      id: "gigaminx",
      fullName: "Gigaminx",
      inventedBy: ["Tyler Fox"],
      inventionYear: 2006,
    }),
    master_tetraminx: new I({
      pgID: "master tetraminx",
      id: "master_tetraminx",
      fullName: "Master Tetraminx",
      inventedBy: ["Katsuhiko Okamoto"],
      inventionYear: 2002,
    }),
    kilominx: Yn,
    redi_cube: Kn,
    melindas2x2x2x2: Hn,
  };
var Ne = { shareAllNewRenderers: "auto", showRenderStats: !1 };
var Ae,
  be,
  Gt,
  Ht =
    ((Gt = class {
      constructor() {
        u(this, Ae, 0);
        u(this, be, 0);
      }
      queue(e) {
        return new Promise(async (t, r) => {
          try {
            let i = ++mt(this, Ae)._,
              n = await e;
            i > c(this, be) && (l(this, be, i), t(n));
          } catch (i) {
            r(i);
          }
        });
      }
    }),
    (Ae = new WeakMap()),
    (be = new WeakMap()),
    Gt),
  Wt = 0,
  C,
  V,
  Be,
  qt,
  O,
  _e,
  Xt,
  Y,
  At,
  jt =
    ((At = class {
      constructor() {
        u(this, Be);
        u(this, _e);
        u(this, C, void 0);
        u(this, V, void 0);
        u(this, O, void 0);
        u(this, Y, void 0);
        l(this, C, new Set()),
          (this.lastSourceGeneration = 0),
          l(this, V, new Set()),
          l(this, O, !1),
          l(this, Y, new Map());
      }
      canReuse(e, t) {
        return e === t || this.canReuseValue(e, t);
      }
      canReuseValue(e, t) {
        return !1;
      }
      debugGetChildren() {
        return Array.from(c(this, C).values());
      }
      addChild(e) {
        c(this, C).add(e);
      }
      removeChild(e) {
        c(this, C).delete(e);
      }
      markStale(e) {
        if (e.detail.generation !== Wt)
          throw new Error("A TwistyProp was marked stale too late!");
        if (this.lastSourceGeneration !== e.detail.generation) {
          this.lastSourceGeneration = e.detail.generation;
          for (let t of c(this, C)) t.markStale(e);
          b(this, Be, qt).call(this);
        }
      }
      addRawListener(e, t) {
        c(this, V).add(e), t?.initial && e();
      }
      removeRawListener(e) {
        c(this, V).delete(e);
      }
      addFreshListener(e) {
        let t = new Ht(),
          r = null,
          i = async () => {
            let n = await t.queue(this.get());
            (r !== null && this.canReuse(r, n)) || ((r = n), e(n));
          };
        c(this, Y).set(e, i), this.addRawListener(i, { initial: !0 });
      }
      removeFreshListener(e) {
        this.removeRawListener(c(this, Y).get(e)), c(this, Y).delete(e);
      }
    }),
    (C = new WeakMap()),
    (V = new WeakMap()),
    (Be = new WeakSet()),
    (qt = function () {
      c(this, O) ||
        (l(this, O, !0), setTimeout(() => b(this, _e, Xt).call(this), 0));
    }),
    (O = new WeakMap()),
    (_e = new WeakSet()),
    (Xt = function () {
      if (!c(this, O)) throw new Error("Invalid dispatch state!");
      for (let e of c(this, V)) e();
      l(this, O, !1);
    }),
    (Y = new WeakMap()),
    At),
  L,
  Bt,
  Wn =
    ((Bt = class extends jt {
      constructor(t) {
        super();
        u(this, L, void 0);
        l(
          this,
          L,
          Ze(() => this.getDefaultValue())
        ),
          t && l(this, L, this.deriveFromPromiseOrValue(t, c(this, L)));
      }
      set(t) {
        l(this, L, this.deriveFromPromiseOrValue(t, c(this, L)));
        let r = { sourceProp: this, value: c(this, L), generation: ++Wt };
        this.markStale(new CustomEvent("stale", { detail: r }));
      }
      async get() {
        return c(this, L);
      }
      async deriveFromPromiseOrValue(t, r) {
        return this.derive(await t, r);
      }
    }),
    (L = new WeakMap()),
    Bt),
  jn = class extends Wn {
    derive(e) {
      return e;
    }
  },
  Ki = Symbol("no value"),
  N,
  ze,
  ne,
  Ue,
  $t,
  Ve,
  Jt,
  _t,
  Hi =
    ((_t = class extends jt {
      constructor(t, r) {
        super();
        u(this, Ue);
        u(this, Ve);
        u(this, N, void 0);
        u(this, ze, null);
        u(this, ne, null);
        (this.userVisibleErrorTracker = r), l(this, N, t);
        for (let i of Object.values(t)) i.addChild(this);
      }
      async get() {
        let t = this.lastSourceGeneration;
        if (c(this, ne)?.generation === t) return c(this, ne).output;
        let r = {
          generation: t,
          output: b(this, Ve, Jt).call(
            this,
            b(this, Ue, $t).call(this),
            t,
            c(this, ze)
          ),
        };
        return l(this, ne, r), this.userVisibleErrorTracker?.reset(), r.output;
      }
    }),
    (N = new WeakMap()),
    (ze = new WeakMap()),
    (ne = new WeakMap()),
    (Ue = new WeakSet()),
    ($t = async function () {
      let t = {};
      for (let [i, n] of Object.entries(c(this, N))) t[i] = n.get();
      let r = {};
      for (let i in c(this, N)) r[i] = await t[i];
      return r;
    }),
    (Ve = new WeakSet()),
    (Jt = async function (t, r, i = null) {
      let n = await t,
        a = (s) => (
          l(this, ze, { inputs: n, output: Promise.resolve(s), generation: r }),
          s
        );
      if (!i) return a(await this.derive(n));
      let o = i.inputs;
      for (let s in c(this, N))
        if (!c(this, N)[s].canReuse(n[s], o[s])) return a(await this.derive(n));
      return i.output;
    }),
    _t),
  ie,
  Ut,
  Wi =
    ((Ut = class {
      constructor() {
        u(this, ie, []);
      }
      addListener(e, t) {
        let r = !1,
          i = (n) => {
            r || t(n);
          };
        e.addFreshListener(i),
          c(this, ie).push(() => {
            e.removeFreshListener(i), (r = !0);
          });
      }
      addMultiListener3(e, t) {
        this.addMultiListener(e, t);
      }
      addMultiListener(e, t) {
        let r = !1,
          i = e.length - 1,
          n = async (a) => {
            if (i > 0) {
              i--;
              return;
            }
            if (r) return;
            let o = e.map((m) => m.get()),
              s = await Promise.all(o);
            t(s);
          };
        for (let a of e) a.addFreshListener(n);
        c(this, ie).push(() => {
          for (let a of e) a.removeFreshListener(n);
          r = !0;
        });
      }
      disconnect() {
        for (let e of c(this, ie)) e();
      }
    }),
    (ie = new WeakMap()),
    Ut),
  Zt = class {
    constructor(e) {
      (this.callback = e),
        (this.animFrameID = null),
        (this.animFrame = this.animFrameWrapper.bind(this));
    }
    requestIsPending() {
      return !!this.animFrameID;
    }
    requestAnimFrame() {
      this.animFrameID ||
        (this.animFrameID = requestAnimationFrame(this.animFrame));
    }
    cancelAnimFrame() {
      this.animFrameID &&
        (cancelAnimationFrame(this.animFrameID), (this.animFrameID = 0));
    }
    animFrameWrapper(e) {
      (this.animFrameID = 0), this.callback(e);
    }
  },
  ji = { floating: !0, none: !0 },
  qi = class extends jn {
    getDefaultValue() {
      return "auto";
    }
  },
  qn = Math.PI * 2,
  Me = 360 / qn,
  Xn = class {},
  at;
globalThis.HTMLElement ? (at = HTMLElement) : (at = Xn);
var $n = class {
    define() {}
  },
  Fe;
globalThis.customElements ? (Fe = customElements) : (Fe = new $n());
var Jn = class {
    constructor(e) {
      this.sourceText = e;
    }
    getAsString() {
      return this.sourceText;
    }
  },
  M,
  Vt,
  Qt =
    ((Vt = class extends at {
      constructor(t) {
        super();
        u(this, M, void 0);
        l(this, M, new Map()),
          (this.shadow = this.attachShadow({ mode: t?.mode ?? "closed" })),
          (this.contentWrapper = document.createElement("div")),
          this.contentWrapper.classList.add("wrapper"),
          this.shadow.appendChild(this.contentWrapper);
      }
      addCSS(t) {
        let r = c(this, M).get(t);
        if (r) return r;
        let i = document.createElement("style");
        return (
          (i.textContent = t.getAsString()),
          c(this, M).set(t, i),
          this.shadow.appendChild(i),
          i
        );
      }
      removeCSS(t) {
        let r = c(this, M).get(t);
        r && (this.shadow.removeChild(r), c(this, M).delete(t));
      }
      addElement(t) {
        return this.contentWrapper.appendChild(t);
      }
      prependElement(t) {
        this.contentWrapper.prepend(t);
      }
      removeElement(t) {
        return this.contentWrapper.removeChild(t);
      }
    }),
    (M = new WeakMap()),
    Vt);
Fe.define("twisty-managed-custom-element", Qt);
var we = globalThis.performance,
  Zn = class {
    constructor() {
      (this.mode = 0),
        (this.dom = document.createElement("div")),
        (this.beginTime = (we || Date).now()),
        (this.prevTime = this.beginTime),
        (this.frames = 0),
        (this.fpsPanel = this.addPanel(new nt("FPS", "#0ff", "#002"))),
        (this.msPanel = this.addPanel(new nt("MS", "#0f0", "#020"))),
        (this.memPanel = we?.memory
          ? this.addPanel(new nt("MB", "#f08", "#201"))
          : null),
        (this.REVISION = 16),
        (this.dom.style.cssText =
          "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000"),
        this.dom.addEventListener(
          "click",
          (e) => {
            e.preventDefault(),
              this.showPanel(++this.mode % this.dom.children.length);
          },
          !1
        ),
        this.showPanel(0);
    }
    addPanel(e) {
      return this.dom.appendChild(e.dom), e;
    }
    showPanel(e) {
      for (let t = 0; t < this.dom.children.length; t++)
        this.dom.children[t].style.display = t === e ? "block" : "none";
      this.mode = e;
    }
    begin() {
      this.beginTime = (we || Date).now();
    }
    end() {
      this.frames++;
      let e = (we || Date).now();
      if (
        (this.msPanel.update(e - this.beginTime, 200),
        e >= this.prevTime + 1e3 &&
          (this.fpsPanel.update((this.frames * 1e3) / (e - this.prevTime), 100),
          (this.prevTime = e),
          (this.frames = 0),
          this.memPanel))
      ) {
        let t = we.memory;
        this.memPanel.update(
          t.usedJSHeapSize / 1048576,
          t.jsHeapSizeLimit / 1048576
        );
      }
      return e;
    }
    update() {
      this.beginTime = this.end();
    }
  },
  w = Math.round(globalThis?.window?.devicePixelRatio ?? 1),
  tt = 80 * w,
  It = 48 * w,
  Ct = 3 * w,
  Ot = 2 * w,
  Q = 3 * w,
  U = 15 * w,
  ee = 74 * w,
  te = 30 * w,
  nt = class {
    constructor(e, t, r) {
      (this.name = e),
        (this.fg = t),
        (this.bg = r),
        (this.min = 1 / 0),
        (this.max = 0),
        (this.dom = document.createElement("canvas")),
        (this.context = this.dom.getContext("2d")),
        (this.dom.width = tt),
        (this.dom.height = It),
        (this.dom.style.cssText = "width:80px;height:48px"),
        (this.context.font = `bold ${9 * w}px Helvetica,Arial,sans-serif`),
        (this.context.textBaseline = "top"),
        (this.context.fillStyle = r),
        this.context.fillRect(0, 0, tt, It),
        (this.context.fillStyle = t),
        this.context.fillText(e, Ct, Ot),
        this.context.fillRect(Q, U, ee, te),
        (this.context.fillStyle = r),
        (this.context.globalAlpha = 0.9),
        this.context.fillRect(Q, U, ee, te);
    }
    update(e, t) {
      (this.min = Math.min(this.min, e)),
        (this.max = Math.max(this.max, e)),
        (this.context.fillStyle = this.bg),
        (this.context.globalAlpha = 1),
        this.context.fillRect(0, 0, tt, U),
        (this.context.fillStyle = this.fg),
        this.context.fillText(
          `${Math.round(e)} ${this.name} (${Math.round(this.min)}-${Math.round(
            this.max
          )})`,
          Ct,
          Ot
        ),
        this.context.drawImage(
          this.dom,
          Q + w,
          U,
          ee - w,
          te,
          Q,
          U,
          ee - w,
          te
        ),
        this.context.fillRect(Q + ee - w, U, w, te),
        (this.context.fillStyle = this.bg),
        (this.context.globalAlpha = 0.9),
        this.context.fillRect(Q + ee - w, U, w, Math.round((1 - e / t) * te));
    }
  },
  Nt = null;
async function Qn() {
  return Nt ?? (Nt = import("./twisty-dynamic-3d-E5SBRWVZ-57CTP3XR.js"));
}
var Ge = Ze(async () => (await Qn()).T3I),
  ei = null;
function st() {
  return ei ?? (devicePixelRatio || 1);
}
var ti = new Jn(`
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  place-content: center;
  contain: strict;
}

.loading {
  width: 4em;
  height: 4em;
  border-radius: 2.5em;
  border: 0.5em solid rgba(0, 0, 0, 0);
  border-top: 0.5em solid rgba(0, 0, 0, 0.7);
  border-right: 0.5em solid rgba(0, 0, 0, 0.7);
  animation: fade-in-delayed 4s, rotate 1s linear infinite;
}

@keyframes fade-in-delayed {
  0% { opacity: 0; }
  25% {opacity: 0; }
  100% { opacity: 1; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* TODO: This is due to stats hack. Replace with \`canvas\`. */
.wrapper > canvas {
  max-width: 100%;
  max-height: 100%;
  animation: fade-in 0.25s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wrapper.invisible {
  opacity: 0;
}

.wrapper.drag-input-enabled > canvas {
  cursor: grab;
}

.wrapper.drag-input-enabled > canvas:active {
  cursor: grabbing;
}
`),
  Mt = 0.1,
  K,
  H,
  re,
  Ye,
  en,
  Ke,
  tn,
  De,
  ot,
  Yt,
  ni =
    ((Yt = class extends EventTarget {
      constructor(t) {
        super();
        u(this, Ye);
        u(this, Ke);
        u(this, De);
        u(this, K, new Map());
        u(this, H, new Map());
        u(this, re, !1);
        this.target = t;
      }
      start() {
        this.addTargetListener("pointerdown", this.onPointerDown.bind(this)),
          this.addTargetListener("contextmenu", (t) => {
            t.preventDefault();
          }),
          this.addTargetListener("touchmove", (t) => t.preventDefault()),
          this.addTargetListener("dblclick", (t) => t.preventDefault());
      }
      stop() {
        for (let [t, r] of c(this, H).entries())
          this.target.removeEventListener(t, r);
        c(this, H).clear(), l(this, re, !1);
      }
      addTargetListener(t, r) {
        c(this, H).has(t) ||
          (this.target.addEventListener(t, r), c(this, H).set(t, r));
      }
      onPointerDown(t) {
        b(this, Ye, en).call(this);
        let r = {
          attachedInfo: {},
          hasMoved: !1,
          lastClientX: t.clientX,
          lastClientY: t.clientY,
          lastTimeStamp: t.timeStamp,
        };
        c(this, K).set(t.pointerId, r),
          this.target.setPointerCapture(t.pointerId);
      }
      onPointerMove(t) {
        let r = b(this, De, ot).call(this, t).movementInfo;
        r &&
          (t.preventDefault(),
          this.dispatchEvent(new CustomEvent("move", { detail: r })));
      }
      onPointerUp(t) {
        let r = b(this, De, ot).call(this, t),
          i = c(this, K).get(t.pointerId);
        b(this, Ke, tn).call(this, t),
          this.target.releasePointerCapture(t.pointerId);
        let n;
        if (r.hasMoved)
          n = new CustomEvent("up", {
            detail: { attachedInfo: i.attachedInfo },
          });
        else {
          let { altKey: a, ctrlKey: o, metaKey: s, shiftKey: m } = t;
          n = new CustomEvent("press", {
            detail: {
              normalizedX: (t.offsetX / this.target.offsetWidth) * 2 - 1,
              normalizedY: 1 - (t.offsetY / this.target.offsetHeight) * 2,
              rightClick: !!(t.button & 2),
              keys: { altKey: a, ctrlOrMetaKey: o || s, shiftKey: m },
            },
          });
        }
        this.dispatchEvent(n);
      }
    }),
    (K = new WeakMap()),
    (H = new WeakMap()),
    (re = new WeakMap()),
    (Ye = new WeakSet()),
    (en = function () {
      c(this, re) ||
        (this.addTargetListener("pointermove", this.onPointerMove.bind(this)),
        this.addTargetListener("pointerup", this.onPointerUp.bind(this)),
        l(this, re, !0));
    }),
    (Ke = new WeakSet()),
    (tn = function (t) {
      c(this, K).delete(t.pointerId);
    }),
    (De = new WeakSet()),
    (ot = function (t) {
      let r = c(this, K).get(t.pointerId);
      if (!r) return { movementInfo: null, hasMoved: !1 };
      let i;
      return (
        (t.movementX ?? 0) !== 0 || (t.movementY ?? 0) !== 0
          ? (i = {
              attachedInfo: r.attachedInfo,
              movementX: t.movementX,
              movementY: t.movementY,
              elapsedMs: t.timeStamp - r.lastTimeStamp,
            })
          : (i = {
              attachedInfo: r.attachedInfo,
              movementX: t.clientX - r.lastClientX,
              movementY: t.clientY - r.lastClientY,
              elapsedMs: t.timeStamp - r.lastTimeStamp,
            }),
        (r.lastClientX = t.clientX),
        (r.lastClientY = t.clientY),
        (r.lastTimeStamp = t.timeStamp),
        Math.abs(i.movementX) < Mt && Math.abs(i.movementY) < Mt
          ? { movementInfo: null, hasMoved: r.hasMoved }
          : ((r.hasMoved = !0), { movementInfo: i, hasMoved: r.hasMoved })
      );
    }),
    Yt),
  ye = [];
async function ii(e, t, r, i) {
  ye.length === 0 && ye.push(ut());
  let n = await ye[0];
  return n.setSize(e, t), n.render(r, i), n.domElement;
}
async function ri(e, t, r, i, n) {
  if (e === 0 || t === 0) return;
  ye.length === 0 && ye.push(ut());
  let a = await ii(e, t, i, n),
    o = r.getContext("2d");
  o.clearRect(0, 0, r.width, r.height), o.drawImage(a, 0, 0);
}
async function ut() {
  let e = (await Ge).WebGLRenderer,
    t = new e({ antialias: !0, alpha: !0 });
  return t.setPixelRatio(st()), t;
}
var ai = !0,
  it = 500,
  si = 50,
  oi = 0.75;
function Ft(e) {
  return (Math.exp(1 - e) - (1 - e)) / (1 - Math.E) + 1;
}
var ci = class {
    constructor(e, t, r, i) {
      (this.startTimestamp = e),
        (this.momentumX = t),
        (this.momentumY = r),
        (this.callback = i),
        (this.scheduler = new Zt(this.render.bind(this))),
        this.scheduler.requestAnimFrame(),
        (this.lastTimestamp = e);
    }
    render(e) {
      let t = (this.lastTimestamp - this.startTimestamp) / it,
        r = Math.min(1, (e - this.startTimestamp) / it);
      if (t === 0 && r > si / it) return;
      let i = Ft(r) - Ft(t);
      this.callback(this.momentumX * i * 1e3, this.momentumY * i * 1e3),
        r < 1 && this.scheduler.requestAnimFrame(),
        (this.lastTimestamp = e);
    }
  },
  li = class {
    constructor(e, t, r, i) {
      (this.model = e),
        (this.mirror = t),
        (this.canvas = r),
        (this.dragTracker = i),
        (this.experimentalInertia = ai),
        (this.onMovementBound = this.onMovement.bind(this)),
        (this.experimentalHasBeenMoved = !1),
        this.dragTracker.addEventListener("move", this.onMove.bind(this)),
        this.dragTracker.addEventListener("up", this.onUp.bind(this));
    }
    temperMovement(e) {
      return (Math.sign(e) * Math.log(Math.abs(e * 10) + 1)) / 6;
    }
    onMove(e) {
      var t;
      (t = e.detail).attachedInfo ?? (t.attachedInfo = {});
      let { temperedX: r, temperedY: i } = this.onMovement(
          e.detail.movementX,
          e.detail.movementY
        ),
        n = e.detail.attachedInfo;
      (n.lastTemperedX = r * 10),
        (n.lastTemperedY = i * 10),
        (n.timestamp = e.timeStamp);
    }
    onMovement(e, t) {
      let r = this.mirror ? -1 : 1,
        i = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight),
        n = this.temperMovement(e / i),
        a = this.temperMovement((t / i) * oi);
      return (
        this.model.twistySceneModel.orbitCoordinatesRequest.set(
          (async () => {
            let o = await this.model.twistySceneModel.orbitCoordinates.get();
            return {
              latitude: o.latitude + 2 * a * Me * r,
              longitude: o.longitude - 2 * n * Me,
            };
          })()
        ),
        { temperedX: n, temperedY: a }
      );
    }
    onUp(e) {
      e.preventDefault(),
        "lastTemperedX" in e.detail.attachedInfo &&
          "lastTemperedY" in e.detail.attachedInfo &&
          "timestamp" in e.detail.attachedInfo &&
          e.timeStamp - e.detail.attachedInfo.timestamp < 60 &&
          new ci(
            e.timeStamp,
            e.detail.attachedInfo.lastTemperedX,
            e.detail.attachedInfo.lastTemperedY,
            this.onMovementBound
          );
    }
  };
async function ui(e, t, r = !1) {
  let i = new (await Ge).Spherical(
    t.distance,
    (90 - (r ? -1 : 1) * t.latitude) / Me,
    ((r ? 180 : 0) + t.longitude) / Me
  );
  i.makeSafe(), e.position.setFromSpherical(i), e.lookAt(0, 0, 0);
}
var rt = 0,
  mi = 2,
  nn = !1;
function di() {
  return Ne.shareAllNewRenderers !== "auto"
    ? (Ne.shareAllNewRenderers || rt++, Ne.shareAllNewRenderers !== "never")
    : rt < mi
    ? (rt++, !1)
    : ((nn = !0), !0);
}
function Xi() {
  return nn;
}
var He,
  rn,
  Ee,
  ae,
  se,
  ke,
  ct,
  oe,
  ce,
  le,
  Te,
  lt,
  ue,
  me,
  W,
  j,
  Le,
  Kt,
  hi =
    ((Kt = class extends Qt {
      constructor(t, r, i) {
        super();
        u(this, He);
        u(this, ke);
        u(this, Te);
        u(this, Ee, void 0);
        u(this, ae, void 0);
        u(this, se, void 0);
        u(this, oe, void 0);
        u(this, ce, void 0);
        u(this, le, void 0);
        u(this, ue, void 0);
        u(this, me, void 0);
        u(this, W, void 0);
        u(this, j, void 0);
        u(this, Le, void 0);
        (this.model = t),
          (this.options = i),
          (this.scene = null),
          (this.stats = null),
          (this.rendererIsShared = di()),
          (this.loadingElement = null),
          l(this, Ee, new Ht()),
          l(this, ae, 0),
          l(this, se, 0),
          l(this, oe, null),
          l(this, ce, null),
          l(this, le, null),
          l(this, ue, null),
          l(this, me, null),
          l(this, W, []),
          l(this, j, null),
          l(this, Le, new Zt(this.render.bind(this))),
          (this.scene = r ?? null),
          (this.loadingElement = this.addElement(
            document.createElement("div")
          )),
          this.loadingElement.classList.add("loading"),
          Ne.showRenderStats &&
            ((this.stats = new Zn()),
            (this.stats.dom.style.position = "absolute"),
            this.contentWrapper.appendChild(this.stats.dom));
      }
      async connectedCallback() {
        this.addCSS(ti),
          this.addElement((await this.canvasInfo()).canvas),
          b(this, ke, ct).call(this),
          new ResizeObserver(b(this, ke, ct).bind(this)).observe(
            this.contentWrapper
          ),
          this.orbitControls(),
          b(this, He, rn).call(this),
          this.scheduleRender();
      }
      async clearCanvas() {
        if (this.rendererIsShared) {
          let t = await this.canvasInfo();
          t.context.clearRect(0, 0, t.canvas.width, t.canvas.height);
        } else {
          let r = (await this.renderer()).getContext();
          r.clear(r.COLOR_BUFFER_BIT);
        }
      }
      async renderer() {
        if (this.rendererIsShared)
          throw new Error("renderer expected to be shared.");
        return c(this, oe) ?? l(this, oe, ut());
      }
      async canvasInfo() {
        return (
          c(this, ce) ??
          l(
            this,
            ce,
            (async () => {
              let t;
              if (this.rendererIsShared)
                t = this.addElement(document.createElement("canvas"));
              else {
                let i = await this.renderer();
                t = this.addElement(i.domElement);
              }
              this.loadingElement?.remove();
              let r = t.getContext("2d");
              return { canvas: t, context: r };
            })()
          )
        );
      }
      async camera() {
        return (
          c(this, ue) ??
          l(
            this,
            ue,
            (async () => {
              let t = new (await Ge).PerspectiveCamera(20, 1, 0.1, 20);
              return (
                t.position.copy(
                  new (await Ge).Vector3(2, 4, 4).multiplyScalar(
                    this.options?.backView ? -1 : 1
                  )
                ),
                t.lookAt(0, 0, 0),
                t
              );
            })()
          )
        );
      }
      async orbitControls() {
        return (
          c(this, me) ??
          l(
            this,
            me,
            (async () => {
              let t = new li(
                this.model,
                !!this.options?.backView,
                (await this.canvasInfo()).canvas,
                await b(this, Te, lt).call(this)
              );
              return (
                this.model &&
                  this.addListener(
                    this.model.twistySceneModel.orbitCoordinates,
                    async (r) => {
                      let i = await this.camera();
                      ui(i, r, this.options?.backView), this.scheduleRender();
                    }
                  ),
                t
              );
            })()
          )
        );
      }
      addListener(t, r) {
        t.addFreshListener(r),
          c(this, W).push(() => {
            t.removeFreshListener(r);
          });
      }
      disconnect() {
        for (let t of c(this, W)) t();
        l(this, W, []);
      }
      experimentalNextRenderFinishedCallback(t) {
        l(this, j, t);
      }
      async render() {
        var n;
        if (!this.scene) throw new Error("Attempted to render without a scene");
        this.stats?.begin();
        let [t, r, i] = await Promise.all([
          this.scene.scene(),
          this.camera(),
          this.canvasInfo(),
        ]);
        this.rendererIsShared
          ? ri(c(this, ae), c(this, se), i.canvas, t, r)
          : (await this.renderer()).render(t, r),
          this.stats?.end(),
          (n = c(this, j)) == null || n.call(this),
          l(this, j, null);
      }
      scheduleRender() {
        c(this, Le).requestAnimFrame();
      }
    }),
    (He = new WeakSet()),
    (rn = async function () {
      (await b(this, Te, lt).call(this)).addEventListener(
        "press",
        async (r) => {
          (await this.model.twistySceneModel.movePressInput.get()) ===
            "basic" &&
            this.dispatchEvent(
              new CustomEvent("press", {
                detail: { pressInfo: r.detail, cameraPromise: this.camera() },
              })
            );
        }
      );
    }),
    (Ee = new WeakMap()),
    (ae = new WeakMap()),
    (se = new WeakMap()),
    (ke = new WeakSet()),
    (ct = async function () {
      let t = await c(this, Ee).queue(this.camera()),
        r = this.contentWrapper.clientWidth,
        i = this.contentWrapper.clientHeight;
      l(this, ae, r), l(this, se, i);
      let n = 0,
        a = 0,
        o = 0;
      if (
        (i > r && ((o = i - r), (a = -Math.floor(0.5 * o))),
        (t.aspect = r / i),
        t.setViewOffset(r, i - o, n, a, r, i),
        t.updateProjectionMatrix(),
        this.clearCanvas(),
        this.rendererIsShared)
      ) {
        let s = await this.canvasInfo();
        (s.canvas.width = r * st()),
          (s.canvas.height = i * st()),
          (s.canvas.style.width = r.toString()),
          (s.canvas.style.height = i.toString());
      } else (await this.renderer()).setSize(r, i, !0);
      this.scheduleRender();
    }),
    (oe = new WeakMap()),
    (ce = new WeakMap()),
    (le = new WeakMap()),
    (Te = new WeakSet()),
    (lt = async function () {
      return (
        c(this, le) ??
        l(
          this,
          le,
          (async () => {
            let t = new ni((await this.canvasInfo()).canvas);
            return (
              this.model?.twistySceneModel.dragInput.addFreshListener((r) => {
                let i = !1;
                switch (r) {
                  case "auto": {
                    t.start(), (i = !0);
                    break;
                  }
                  case "none": {
                    t.stop();
                    break;
                  }
                }
                this.contentWrapper.classList.toggle("drag-input-enabled", i);
              }),
              t
            );
          })()
        )
      );
    }),
    (ue = new WeakMap()),
    (me = new WeakMap()),
    (W = new WeakMap()),
    (j = new WeakMap()),
    (Le = new WeakMap()),
    Kt);
Fe.define("twisty-3d-vantage", hi);
export {
  zi as a,
  vn as b,
  Di as c,
  Ei as d,
  Gi as e,
  Rt as f,
  Ai as g,
  Ht as h,
  Wn as i,
  jn as j,
  Ki as k,
  Hi as l,
  Wi as m,
  Zt as n,
  ji as o,
  qi as p,
  qn as q,
  Me as r,
  at as s,
  Fe as t,
  Jn as u,
  Qt as v,
  Qn as w,
  Ge as x,
  ii as y,
  ui as z,
  Xi as A,
  hi as B,
};
//# sourceMappingURL=chunk-MKZT3SA5.js.map
