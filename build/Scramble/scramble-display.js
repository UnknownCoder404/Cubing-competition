import {
  B as dt,
  b as Tt,
  c as It,
  d as St,
  e as at,
  f as ot,
  g as qe,
  h as lt,
  i as q,
  j as w,
  k as se,
  l as f,
  m as ne,
  n as ze,
  p as kt,
  r as bt,
  s as ct,
  t as T,
  u as C,
  v as k,
  w as Dt,
  x as Z,
  y as Ct,
  z as Et,
} from "./chunks/chunk-MKZT3SA5.js";
import {
  a as At,
  b as Lt,
  c as Fe,
  d as Be,
  e as We,
  g as d,
  h as re,
  i as xe,
  j as O,
  k as S,
  l as nt,
  m as A,
} from "./chunks/chunk-RSKU6P22.js";
import { c as a, d as c, e as u, g as j } from "./chunks/chunk-YJ5RMHHJ.js";
var ut = class extends O {
  constructor(e) {
    super(), (this.metric = e);
  }
  traverseAlg(e) {
    let t = 0;
    for (let i of e.childAlgNodes()) t += this.traverseAlgNode(i);
    return t;
  }
  traverseGrouping(e) {
    let t = e.alg;
    return this.traverseAlg(t) * Math.abs(e.amount);
  }
  traverseMove(e) {
    return this.metric(e);
  }
  traverseCommutator(e) {
    return 2 * (this.traverseAlg(e.A) + this.traverseAlg(e.B));
  }
  traverseConjugate(e) {
    return 2 * this.traverseAlg(e.A) + this.traverseAlg(e.B);
  }
  traversePause(e) {
    return 0;
  }
  traverseNewline(e) {
    return 0;
  }
  traverseLineComment(e) {
    return 0;
  }
};
function Nt(e) {
  return "A" <= e && e <= "Z";
}
function qi(e) {
  let t = e.family;
  return (Nt(t[0]) && t[t.length - 1] === "v") ||
    t === "x" ||
    t === "y" ||
    t === "z" ||
    t === "T"
    ? 0
    : 1;
}
function Hi(e) {
  return 1;
}
function Qi(e) {
  let t = e.family;
  return (Nt(t[0]) && t[t.length - 1] === "v") ||
    t === "x" ||
    t === "y" ||
    t === "z" ||
    t === "T"
    ? 0
    : Math.abs(e.amount);
}
var ht = S(ut, [qi]),
  Sn = S(ut, [Hi]),
  kn = S(ut, [Qi]),
  Yi = class extends O {
    traverseAlg(e) {
      let t = 0;
      for (let i of e.childAlgNodes()) t += this.traverseAlgNode(i);
      return t;
    }
    traverseGrouping(e) {
      return this.traverseAlg(e.alg) * Math.abs(e.amount);
    }
    traverseMove(e) {
      return 1;
    }
    traverseCommutator(e) {
      return 2 * (this.traverseAlg(e.A) + this.traverseAlg(e.B));
    }
    traverseConjugate(e) {
      return 2 * this.traverseAlg(e.A) + this.traverseAlg(e.B);
    }
    traversePause(e) {
      return 1;
    }
    traverseNewline(e) {
      return 0;
    }
    traverseLineComment(e) {
      return 0;
    }
  },
  Pt = S(Yi);
function ft(e, t) {
  if (e === t) return !0;
  if (e.length !== t.length) return !1;
  for (let i = 0; i < e.length; i++) if (e[i] !== t[i]) return !1;
  return !0;
}
function Rt(e, t, i) {
  if (e === t) return !0;
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) if (!i(e[r], t[r])) return !1;
  return !0;
}
function yi(e, t, i = 0) {
  return (((e % t) + t + i) % t) - i;
}
function jt(e, t, i) {
  return yi(e - t, i - t) + t;
}
var _i = class {
    constructor(e) {
      (this.model = e),
        (this.catchingUp = !1),
        (this.pendingFrame = !1),
        (this.scheduler = new ze(this.animFrame.bind(this))),
        (this.catchUpMs = 500),
        (this.lastTimestamp = 0);
    }
    start() {
      this.catchingUp || (this.lastTimestamp = performance.now()),
        (this.catchingUp = !0),
        (this.pendingFrame = !0),
        this.scheduler.requestAnimFrame();
    }
    stop() {
      (this.catchingUp = !1), this.scheduler.cancelAnimFrame();
    }
    animFrame(e) {
      this.scheduler.requestAnimFrame();
      let t = (e - this.lastTimestamp) / this.catchUpMs;
      (this.lastTimestamp = e),
        this.model.catchUpMove.set(
          (async () => {
            let i = await this.model.catchUpMove.get();
            if (i.move === null) return i;
            let r = i.amount + t;
            return r >= 1
              ? ((this.pendingFrame = !0),
                this.stop(),
                this.model.timestampRequest.set("end"),
                { move: null, amount: 0 })
              : ((this.pendingFrame = !1), { move: i.move, amount: r });
          })()
        );
    }
  },
  Ae,
  wt,
  Le,
  ri,
  Gi =
    ((ri = class {
      constructor(e, t) {
        c(this, Ae);
        c(this, Le, void 0);
        (this.delegate = t),
          (this.playing = !1),
          (this.direction = 1),
          (this.lastDatestamp = 0),
          (this.scheduler = new ze(this.animFrame.bind(this))),
          u(this, Le, new lt()),
          (this.model = e),
          (this.lastTimestampPromise = j(this, Ae, wt).call(this)),
          this.model.playingInfo.addFreshListener(
            this.onPlayingProp.bind(this)
          ),
          (this.catchUpHelper = new _i(this.model)),
          this.model.catchUpMove.addFreshListener(
            this.onCatchUpMoveProp.bind(this)
          );
      }
      async onPlayingProp(e) {
        e.playing !== this.playing && (e.playing ? this.play(e) : this.pause());
      }
      async onCatchUpMoveProp(e) {
        let t = e.move !== null;
        t !== this.catchUpHelper.catchingUp &&
          (t ? this.catchUpHelper.start() : this.catchUpHelper.stop()),
          this.scheduler.requestAnimFrame();
      }
      jumpToStart(e) {
        this.model.timestampRequest.set("start"),
          this.pause(),
          e?.flash && this.delegate.flash();
      }
      jumpToEnd(e) {
        this.model.timestampRequest.set("end"),
          this.pause(),
          e?.flash && this.delegate.flash();
      }
      playPause() {
        this.playing ? this.pause() : this.play();
      }
      async play(e) {
        let t = e?.direction ?? 1,
          i = await this.model.coarseTimelineInfo.get();
        (e?.autoSkipToOtherEndIfStartingAtBoundary ?? !0) &&
          (t === 1 &&
            i.atEnd &&
            (this.model.timestampRequest.set("start"), this.delegate.flash()),
          t === -1 &&
            i.atStart &&
            (this.model.timestampRequest.set("end"), this.delegate.flash())),
          this.model.playingInfo.set({
            playing: !0,
            direction: t,
            untilBoundary: e?.untilBoundary ?? "entire-timeline",
            loop: e?.loop ?? !1,
          }),
          (this.playing = !0),
          (this.lastDatestamp = performance.now()),
          (this.lastTimestampPromise = j(this, Ae, wt).call(this)),
          this.scheduler.requestAnimFrame();
      }
      pause() {
        (this.playing = !1),
          this.scheduler.cancelAnimFrame(),
          this.model.playingInfo.set({
            playing: !1,
            untilBoundary: "entire-timeline",
          });
      }
      async animFrame(e) {
        this.playing && this.scheduler.requestAnimFrame();
        let t = this.lastDatestamp,
          i = await a(this, Le).queue(
            Promise.all([
              this.model.playingInfo.get(),
              this.lastTimestampPromise,
              this.model.timeRange.get(),
              this.model.tempoScale.get(),
              this.model.currentMoveInfo.get(),
            ])
          ),
          [r, s, n, o, l] = i;
        if (!r.playing) {
          this.playing = !1;
          return;
        }
        let m = l.earliestEnd;
        (l.currentMoves.length === 0 ||
          r.untilBoundary === "entire-timeline") &&
          (m = n.end);
        let h = l.latestStart;
        (l.currentMoves.length === 0 ||
          r.untilBoundary === "entire-timeline") &&
          (h = n.start);
        let v = (e - t) * this.direction * o;
        (v = Math.max(v, 1)), (v *= r.direction);
        let p = s + v,
          z = null;
        p >= m
          ? r.loop
            ? (p = jt(p, n.start, n.end))
            : (p === n.end ? (z = "end") : (p = m),
              (this.playing = !1),
              this.model.playingInfo.set({ playing: !1 }))
          : p <= h &&
            (r.loop
              ? (p = jt(p, n.start, n.end))
              : (p === n.start ? (z = "start") : (p = h),
                (this.playing = !1),
                this.model.playingInfo.set({ playing: !1 }))),
          (this.lastDatestamp = e),
          (this.lastTimestampPromise = Promise.resolve(p)),
          this.model.timestampRequest.set(z ?? p);
      }
    }),
    (Ae = new WeakSet()),
    (wt = async function () {
      return (await this.model.detailedTimelineInfo.get()).timestamp;
    }),
    (Le = new WeakMap()),
    ri),
  Zi = class {
    constructor(e, t) {
      (this.model = e), (this.animationController = new Gi(e, t));
    }
    jumpToStart(e) {
      this.animationController.jumpToStart(e);
    }
    jumpToEnd(e) {
      this.animationController.jumpToEnd(e);
    }
    togglePlay(e) {
      typeof e > "u" && this.animationController.playPause(),
        e ? this.animationController.play() : this.animationController.pause();
    }
    async visitTwizzleLink() {
      let e = document.createElement("a");
      (e.href = await this.model.twizzleLink()),
        (e.target = "_blank"),
        e.click();
    }
  },
  Xi = { "bottom-row": !0, none: !0 },
  $i = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  Mi = new C(`
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
}

.wrapper > * {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wrapper.back-view-side-by-side {
  grid-template-columns: 1fr 1fr;
}

.wrapper.back-view-top-right {
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 3fr;
}

.wrapper.back-view-top-right > :nth-child(1) {
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.wrapper.back-view-top-right > :nth-child(2) {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}
`),
  He = "http://www.w3.org/2000/svg",
  Ot = "data-copy-id",
  Vt = 0;
function Ji() {
  return (Vt += 1), `svg${Vt.toString()}`;
}
var Ki = {
    dim: {
      white: "#dddddd",
      orange: "#884400",
      limegreen: "#008800",
      red: "#660000",
      "rgb(34, 102, 255)": "#000088",
      yellow: "#888800",
    },
    oriented: {
      white: "#44ddcc",
      orange: "#44ddcc",
      limegreen: "#44ddcc",
      red: "#44ddcc",
      "rgb(34, 102, 255)": "#44ddcc",
      yellow: "#44ddcc",
    },
    ignored: {
      white: "#444444",
      orange: "#444444",
      limegreen: "#444444",
      red: "#444444",
      "rgb(34, 102, 255)": "#444444",
      yellow: "#444444",
    },
    invisible: {
      white: "#00000000",
      orange: "#00000000",
      limegreen: "#00000000",
      red: "#00000000",
      "rgb(34, 102, 255)": "#00000000",
      yellow: "#00000000",
    },
  },
  er = class {
    constructor(e, t, i) {
      if (
        ((this.kpuzzle = e),
        (this.originalColors = {}),
        (this.gradients = {}),
        !t)
      )
        throw new Error(`No SVG definition for puzzle type: ${e.name()}`);
      (this.svgID = Ji()),
        (this.wrapperElement = document.createElement("div")),
        this.wrapperElement.classList.add("svg-wrapper"),
        (this.wrapperElement.innerHTML = t);
      let r = this.wrapperElement.querySelector("svg");
      if (!r) throw new Error("Could not get SVG element");
      if (((this.svgElement = r), He !== r.namespaceURI))
        throw new Error("Unexpected XML namespace");
      (r.style.maxWidth = "100%"),
        (r.style.maxHeight = "100%"),
        (this.gradientDefs = document.createElementNS(He, "defs")),
        r.insertBefore(this.gradientDefs, r.firstChild);
      for (let s in e.definition.orbits) {
        let n = e.definition.orbits[s];
        for (let o = 0; o < n.numPieces; o++)
          for (let l = 0; l < n.numOrientations; l++) {
            let m = this.elementID(s, o, l),
              h = this.elementByID(m),
              v = h.style.fill;
            i
              ? (() => {
                  let p = i.orbits;
                  if (!p) return;
                  let z = p[s];
                  if (!z) return;
                  let L = z.pieces[o];
                  if (!L) return;
                  let I = L.facelets[l];
                  if (!I) return;
                  let W = typeof I == "string" ? I : I?.mask,
                    st = Ki[W];
                  st && (v = st[v]);
                })()
              : (v = h.style.fill),
              (this.originalColors[m] = v),
              (this.gradients[m] = this.newGradient(m, v)),
              this.gradientDefs.appendChild(this.gradients[m]),
              h.setAttribute("style", `fill: url(#grad-${this.svgID}-${m})`);
          }
      }
      for (let s of Array.from(r.querySelectorAll(`[${Ot}]`))) {
        let n = s.getAttribute(Ot);
        s.setAttribute("style", `fill: url(#grad-${this.svgID}-${n})`);
      }
    }
    drawState(e, t, i) {
      this.draw(e, t, i);
    }
    draw(e, t, i) {
      let r = e.experimentalToTransformation(),
        s = t?.experimentalToTransformation();
      if (!r)
        throw new Error("Distinguishable pieces are not handled for SVG yet!");
      for (let n in r.kpuzzle.definition.orbits) {
        let o = r.kpuzzle.definition.orbits[n],
          l = r.transformationData[n],
          m = s ? s.transformationData[n] : null;
        for (let h = 0; h < o.numPieces; h++)
          for (let v = 0; v < o.numOrientations; v++) {
            let p = this.elementID(n, h, v),
              z = this.elementID(
                n,
                l.permutation[h],
                (o.numOrientations - l.orientation[h] + v) % o.numOrientations
              ),
              L = !1;
            if (m) {
              let I = this.elementID(
                n,
                m.permutation[h],
                (o.numOrientations - m.orientation[h] + v) % o.numOrientations
              );
              z === I && (L = !0), (i = i || 0);
              let W = 100 * (1 - i * i * (2 - i * i));
              this.gradients[p].children[0].setAttribute(
                "stop-color",
                this.originalColors[z]
              ),
                this.gradients[p].children[1].setAttribute(
                  "stop-color",
                  this.originalColors[z]
                ),
                this.gradients[p].children[1].setAttribute(
                  "offset",
                  `${Math.max(W - 5, 0)}%`
                ),
                this.gradients[p].children[2].setAttribute(
                  "offset",
                  `${Math.max(W - 5, 0)}%`
                ),
                this.gradients[p].children[3].setAttribute("offset", `${W}%`),
                this.gradients[p].children[4].setAttribute("offset", `${W}%`),
                this.gradients[p].children[4].setAttribute(
                  "stop-color",
                  this.originalColors[I]
                ),
                this.gradients[p].children[5].setAttribute(
                  "stop-color",
                  this.originalColors[I]
                );
            } else L = !0;
            L &&
              (this.gradients[p].children[0].setAttribute(
                "stop-color",
                this.originalColors[z]
              ),
              this.gradients[p].children[1].setAttribute(
                "stop-color",
                this.originalColors[z]
              ),
              this.gradients[p].children[1].setAttribute("offset", "100%"),
              this.gradients[p].children[2].setAttribute("offset", "100%"),
              this.gradients[p].children[3].setAttribute("offset", "100%"),
              this.gradients[p].children[4].setAttribute("offset", "100%"));
          }
      }
    }
    newGradient(e, t) {
      let i = document.createElementNS(He, "radialGradient");
      i.setAttribute("id", `grad-${this.svgID}-${e}`),
        i.setAttribute("r", "70.7107%");
      let r = [
        { offset: 0, color: t },
        { offset: 0, color: t },
        { offset: 0, color: "black" },
        { offset: 0, color: "black" },
        { offset: 0, color: t },
        { offset: 100, color: t },
      ];
      for (let s of r) {
        let n = document.createElementNS(He, "stop");
        n.setAttribute("offset", `${s.offset}%`),
          n.setAttribute("stop-color", s.color),
          n.setAttribute("stop-opacity", "1"),
          i.appendChild(n);
      }
      return i;
    }
    elementID(e, t, i) {
      return `${e}-l${t}-o${i}`;
    }
    elementByID(e) {
      return this.wrapperElement.querySelector(`#${e}`);
    }
  },
  tr = new C(`
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
}

.svg-wrapper,
twisty-2d-svg,
svg {
  width: 100%;
  height: 100%;
  display: grid;
  min-height: 0;
}

svg {
  animation: fade-in 0.25s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
`),
  J,
  K,
  si,
  xi =
    ((si = class extends k {
      constructor(t, i, r, s, n) {
        super();
        c(this, J, void 0);
        c(this, K, void 0);
        (this.model = t),
          (this.kpuzzle = i),
          (this.svgSource = r),
          (this.options = s),
          (this.puzzleLoader = n),
          (this.scheduler = new ze(this.render.bind(this))),
          u(this, J, null),
          u(this, K, new ne()),
          this.addCSS(tr),
          this.resetSVG(),
          a(this, K).addListener(this.model.puzzleID, (o) => {
            n?.id !== o && this.disconnect();
          }),
          a(this, K).addListener(
            this.model.legacyPosition,
            this.onPositionChange.bind(this)
          ),
          this.options?.experimentalStickeringMask &&
            this.experimentalSetStickeringMask(
              this.options.experimentalStickeringMask
            );
      }
      disconnect() {
        a(this, K).disconnect();
      }
      onPositionChange(t) {
        try {
          if (t.movesInProgress.length > 0) {
            let i = t.movesInProgress[0].move,
              r = i;
            t.movesInProgress[0].direction === -1 && (r = i.invert());
            let s = t.state.applyMove(r);
            this.svgWrapper.draw(t.state, s, t.movesInProgress[0].fraction);
          } else this.svgWrapper.draw(t.state), u(this, J, t);
        } catch (i) {
          console.warn(
            "Bad position (this doesn't necessarily mean something is wrong). Pre-emptively disconnecting:",
            this.puzzleLoader?.id,
            i
          ),
            this.disconnect();
        }
      }
      scheduleRender() {
        this.scheduler.requestAnimFrame();
      }
      experimentalSetStickeringMask(t) {
        this.resetSVG(t);
      }
      resetSVG(t) {
        this.svgWrapper && this.removeElement(this.svgWrapper.wrapperElement),
          this.kpuzzle &&
            ((this.svgWrapper = new er(this.kpuzzle, this.svgSource, t)),
            this.addElement(this.svgWrapper.wrapperElement),
            a(this, J) && this.onPositionChange(a(this, J)));
      }
      render() {}
    }),
    (J = new WeakMap()),
    (K = new WeakMap()),
    si);
T.define("twisty-2d-puzzle", xi);
var Te,
  Ie,
  ni,
  ir =
    ((ni = class {
      constructor(e, t, i, r) {
        c(this, Te, new ne());
        c(this, Ie, null);
        (this.model = e),
          (this.schedulable = t),
          (this.puzzleLoader = i),
          (this.effectiveVisualization = r),
          this.twisty2DPuzzle(),
          a(this, Te).addListener(
            this.model.twistySceneModel.stickeringMask,
            async (s) => {
              (await this.twisty2DPuzzle()).experimentalSetStickeringMask(s);
            }
          );
      }
      disconnect() {
        a(this, Te).disconnect();
      }
      scheduleRender() {}
      async twisty2DPuzzle() {
        return (
          a(this, Ie) ??
          u(
            this,
            Ie,
            (async () => {
              let e =
                this.effectiveVisualization === "experimental-2D-LL"
                  ? this.puzzleLoader.llSVG()
                  : this.puzzleLoader.svg();
              return new xi(
                this.model,
                await this.puzzleLoader.kpuzzle(),
                await e,
                {},
                this.puzzleLoader
              );
            })()
          )
        );
      }
    }),
    (Te = new WeakMap()),
    (Ie = new WeakMap()),
    ni),
  Se,
  ke,
  H,
  ai,
  zi =
    ((ai = class extends k {
      constructor(t, i) {
        super();
        c(this, Se, new ne());
        c(this, ke, void 0);
        c(this, H, null);
        (this.model = t), (this.effectiveVisualization = i);
      }
      disconnect() {
        a(this, Se).disconnect();
      }
      async connectedCallback() {
        this.addCSS(Mi),
          this.model &&
            a(this, Se).addListener(
              this.model.twistyPlayerModel.puzzleLoader,
              this.onPuzzleLoader.bind(this)
            );
      }
      async scene() {
        return (
          a(this, ke) ?? u(this, ke, (async () => new (await Z).Scene())())
        );
      }
      scheduleRender() {
        a(this, H)?.scheduleRender();
      }
      currentTwisty2DPuzzleWrapper() {
        return a(this, H);
      }
      async setCurrentTwisty2DPuzzleWrapper(t) {
        let i = a(this, H);
        u(this, H, t), i?.disconnect();
        let r = t.twisty2DPuzzle();
        (this.contentWrapper.textContent = ""), this.addElement(await r);
      }
      async onPuzzleLoader(t) {
        a(this, H)?.disconnect();
        let i = new ir(
          this.model.twistyPlayerModel,
          this,
          t,
          this.effectiveVisualization
        );
        this.setCurrentTwisty2DPuzzleWrapper(i);
      }
    }),
    (Se = new WeakMap()),
    (ke = new WeakMap()),
    (H = new WeakMap()),
    ai);
T.define("twisty-2d-scene-wrapper", zi);
var Q,
  oi,
  it =
    ((oi = class {
      constructor(e, t, i) {
        c(this, Q, null);
        (this.elem = e), (this.prefix = t), (this.validSuffixes = i);
      }
      clearValue() {
        a(this, Q) && this.elem.contentWrapper.classList.remove(a(this, Q)),
          u(this, Q, null);
      }
      setValue(e) {
        if (!this.validSuffixes.includes(e))
          throw new Error(`Invalid suffix: ${e}`);
        let t = `${this.prefix}${e}`,
          i = a(this, Q) !== t;
        return (
          i &&
            (this.clearValue(),
            this.elem.contentWrapper.classList.add(t),
            u(this, Q, t)),
          i
        );
      }
    }),
    (Q = new WeakMap()),
    oi),
  be,
  li,
  Ai =
    ((li = class {
      constructor() {
        c(this, be, void 0);
        this.promise = new Promise((e, t) => {
          u(this, be, e), (this.reject = t);
        });
      }
      handleNewValue(e) {
        a(this, be).call(this, e);
      }
    }),
    (be = new WeakMap()),
    li),
  b,
  De,
  ci,
  Li =
    ((ci = class extends EventTarget {
      constructor(t, i, r, s) {
        super();
        c(this, b, new ne());
        c(this, De, null);
        (this.model = t),
          (this.schedulable = i),
          (this.puzzleLoader = r),
          (this.visualizationStrategy = s),
          this.twisty3DPuzzle(),
          a(this, b).addListener(this.model.puzzleLoader, (n) => {
            this.puzzleLoader.id !== n.id && this.disconnect();
          }),
          a(this, b).addListener(this.model.legacyPosition, async (n) => {
            try {
              (await this.twisty3DPuzzle()).onPositionChange(n),
                this.scheduleRender();
            } catch {
              this.disconnect();
            }
          }),
          a(this, b).addListener(
            this.model.twistySceneModel.hintFacelet,
            async (n) => {
              (await this.twisty3DPuzzle()).experimentalUpdateOptions({
                hintFacelets: n === "auto" ? "floating" : n,
              }),
                this.scheduleRender();
            }
          ),
          a(this, b).addListener(
            this.model.twistySceneModel.foundationDisplay,
            async (n) => {
              (await this.twisty3DPuzzle()).experimentalUpdateOptions({
                showFoundation: n !== "none",
              }),
                this.scheduleRender();
            }
          ),
          a(this, b).addListener(
            this.model.twistySceneModel.stickeringMask,
            async (n) => {
              (await this.twisty3DPuzzle()).setStickeringMask(n),
                this.scheduleRender();
            }
          ),
          a(this, b).addListener(
            this.model.twistySceneModel.faceletScale,
            async (n) => {
              (await this.twisty3DPuzzle()).experimentalUpdateOptions({
                faceletScale: n,
              }),
                this.scheduleRender();
            }
          ),
          a(this, b).addMultiListener3(
            [
              this.model.twistySceneModel.stickeringMask,
              this.model.twistySceneModel.foundationStickerSprite,
              this.model.twistySceneModel.hintStickerSprite,
            ],
            async (n) => {
              "experimentalUpdateTexture" in (await this.twisty3DPuzzle()) &&
                ((await this.twisty3DPuzzle()).experimentalUpdateTexture(
                  n[0].specialBehaviour === "picture",
                  n[1],
                  n[2]
                ),
                this.scheduleRender());
            }
          );
      }
      disconnect() {
        a(this, b).disconnect();
      }
      scheduleRender() {
        this.schedulable.scheduleRender(),
          this.dispatchEvent(new CustomEvent("render-scheduled"));
      }
      async twisty3DPuzzle() {
        return (
          a(this, De) ??
          u(
            this,
            De,
            (async () => {
              let t = Dt();
              if (
                this.puzzleLoader.id === "3x3x3" &&
                this.visualizationStrategy === "Cube3D"
              ) {
                let [i, r, s, n] = await Promise.all([
                  this.model.twistySceneModel.foundationStickerSprite.get(),
                  this.model.twistySceneModel.hintStickerSprite.get(),
                  this.model.twistySceneModel.stickeringMask.get(),
                  this.model.twistySceneModel.initialHintFaceletsAnimation.get(),
                ]);
                return (await t).cube3DShim(
                  () => this.schedulable.scheduleRender(),
                  {
                    foundationSprite: i,
                    hintSprite: r,
                    experimentalStickeringMask: s,
                    initialHintFaceletsAnimation: n,
                  }
                );
              } else {
                let [i, r, s, n] = await Promise.all([
                    this.model.twistySceneModel.hintFacelet.get(),
                    this.model.twistySceneModel.foundationStickerSprite.get(),
                    this.model.twistySceneModel.hintStickerSprite.get(),
                    this.model.twistySceneModel.faceletScale.get(),
                  ]),
                  o = (await t).pg3dShim(
                    () => this.schedulable.scheduleRender(),
                    this.puzzleLoader,
                    i === "auto" ? "floating" : i,
                    n
                  );
                return (
                  o.then((l) =>
                    l.experimentalUpdateTexture(!0, r ?? void 0, s ?? void 0)
                  ),
                  o
                );
              }
            })()
          )
        );
      }
      async raycastMove(t, i) {
        let r = await this.twisty3DPuzzle();
        if (!("experimentalGetControlTargets" in r)) {
          console.info("not PG3D! skipping raycast");
          return;
        }
        let s = r.experimentalGetControlTargets(),
          [n, o] = await Promise.all([
            t,
            this.model.twistySceneModel.movePressCancelOptions.get(),
          ]),
          l = n.intersectObjects(s);
        if (l.length > 0) {
          let m = r.getClosestMoveToAxis(l[0].point, i);
          m
            ? this.model.experimentalAddMove(m.move, { cancel: o })
            : console.info("Skipping move!");
        }
      }
    }),
    (b = new WeakMap()),
    (De = new WeakMap()),
    ci),
  Xe,
  le,
  V,
  Ce,
  ee,
  U,
  Ee,
  $e,
  di,
  vt =
    ((di = class extends k {
      constructor(t) {
        super();
        c(
          this,
          Xe,
          new it(this, "back-view-", [
            "auto",
            "none",
            "side-by-side",
            "top-right",
          ])
        );
        c(this, le, new ne());
        c(this, V, null);
        c(this, Ce, void 0);
        c(this, ee, new Set());
        c(this, U, null);
        c(this, Ee, new Ai());
        c(this, $e, new lt());
        this.model = t;
      }
      disconnect() {
        a(this, le).disconnect();
      }
      async connectedCallback() {
        this.addCSS(Mi);
        let t = new dt(this.model, this);
        this.addVantage(t),
          this.model &&
            (a(this, le).addMultiListener(
              [this.model.puzzleLoader, this.model.visualizationStrategy],
              this.onPuzzle.bind(this)
            ),
            a(this, le).addListener(
              this.model.backView,
              this.onBackView.bind(this)
            )),
          this.scheduleRender();
      }
      setBackView(t) {
        let i = ["side-by-side", "top-right"].includes(t),
          r = a(this, V) !== null;
        a(this, Xe).setValue(t),
          i
            ? r ||
              (u(this, V, new dt(this.model, this, { backView: !0 })),
              this.addVantage(a(this, V)),
              this.scheduleRender())
            : a(this, V) && (this.removeVantage(a(this, V)), u(this, V, null));
      }
      onBackView(t) {
        this.setBackView(t);
      }
      async onPress(t) {
        let i = a(this, U);
        if (!i) {
          console.info("no wrapper; skipping scene wrapper press!");
          return;
        }
        let r = (async () => {
          let [s, n] = await Promise.all([t.detail.cameraPromise, Z]),
            o = new n.Raycaster(),
            l = new (await Z).Vector2(
              t.detail.pressInfo.normalizedX,
              t.detail.pressInfo.normalizedY
            );
          return o.setFromCamera(l, s), o;
        })();
        i.raycastMove(r, {
          invert: !t.detail.pressInfo.rightClick,
          depth: t.detail.pressInfo.keys.ctrlOrMetaKey
            ? "rotation"
            : t.detail.pressInfo.keys.shiftKey
            ? "secondSlice"
            : "none",
        });
      }
      async scene() {
        return (
          a(this, Ce) ?? u(this, Ce, (async () => new (await Z).Scene())())
        );
      }
      addVantage(t) {
        t.addEventListener("press", this.onPress.bind(this)),
          a(this, ee).add(t),
          this.contentWrapper.appendChild(t);
      }
      removeVantage(t) {
        a(this, ee).delete(t),
          t.remove(),
          t.disconnect(),
          a(this, U)?.disconnect();
      }
      experimentalVantages() {
        return a(this, ee).values();
      }
      scheduleRender() {
        for (let t of a(this, ee)) t.scheduleRender();
      }
      async setCurrentTwisty3DPuzzleWrapper(t, i) {
        let r = a(this, U);
        try {
          u(this, U, i), r?.disconnect(), t.add(await i.twisty3DPuzzle());
        } finally {
          r && t.remove(await r.twisty3DPuzzle());
        }
        a(this, Ee).handleNewValue(i);
      }
      async experimentalTwisty3DPuzzleWrapper() {
        return a(this, U) || a(this, Ee).promise;
      }
      async onPuzzle(t) {
        if (t[1] === "2D") return;
        a(this, U)?.disconnect();
        let [i, r] = await a(this, $e).queue(
          Promise.all([this.scene(), new Li(this.model, this, t[0], t[1])])
        );
        this.setCurrentTwisty3DPuzzleWrapper(i, r);
      }
    }),
    (Xe = new WeakMap()),
    (le = new WeakMap()),
    (V = new WeakMap()),
    (Ce = new WeakMap()),
    (ee = new WeakMap()),
    (U = new WeakMap()),
    (Ee = new WeakMap()),
    ($e = new WeakMap()),
    di);
T.define("twisty-3d-scene-wrapper", vt);
var rr = new C(`
:host {
  width: 384px;
  height: 24px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wrapper {
  grid-auto-flow: column;
}

.viewer-link-none .twizzle-link-button {
  display: none;
}

.wrapper twisty-button,
.wrapper twisty-control-button {
  width: inherit;
  height: inherit;
}
`),
  sr = new C(`
:host:not([hidden]) {
  display: grid;
}

:host {
  width: 48px;
  height: 24px;
}

.wrapper {
  width: 100%;
  height: 100%;
}

button {
  width: 100%;
  height: 100%;
  border: none;
  
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  background-color: rgba(196, 196, 196, 0.75);
}

button:enabled {
  background-color: rgba(196, 196, 196, 0.75)
}

button:disabled {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.25;
  pointer-events: none;
}

button:enabled:hover {
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

/* TODO: fullscreen icons have too much padding?? */
.svg-skip-to-start button,
button.svg-skip-to-start {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjQzIDEwMzdxMTktMTkgMzItMTN0MTMgMzJ2MTQ3MnEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djcxMHEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djY3OHEwIDI2LTE5IDQ1dC00NSAxOUg5NjBxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWgxMjhxMjYgMCA0NSAxOXQxOSA0NXY2NzhxNC0xMSAxMy0xOWw3MTAtNzEwcTE5LTE5IDMyLTEzdDEzIDMydjcxMHE0LTExIDEzLTE5eiIvPjwvc3ZnPg==");
}

.svg-skip-to-end button,
button.svg-skip-to-end {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik05NDEgMjU0N3EtMTkgMTktMzIgMTN0LTEzLTMyVjEwNTZxMC0yNiAxMy0zMnQzMiAxM2w3MTAgNzEwcTggOCAxMyAxOXYtNzEwcTAtMjYgMTMtMzJ0MzIgMTNsNzEwIDcxMHE4IDggMTMgMTl2LTY3OHEwLTI2IDE5LTQ1dDQ1LTE5aDEyOHEyNiAwIDQ1IDE5dDE5IDQ1djE0MDhxMCAyNi0xOSA0NXQtNDUgMTloLTEyOHEtMjYgMC00NS0xOXQtMTktNDV2LTY3OHEtNSAxMC0xMyAxOWwtNzEwIDcxMHEtMTkgMTktMzIgMTN0LTEzLTMydi03MTBxLTUgMTAtMTMgMTl6Ii8+PC9zdmc+");
}

.svg-step-forward button,
button.svg-step-forward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDE1NjhxMCAyNi0xOSA0NWwtNTEyIDUxMnEtMTkgMTktNDUgMTl0LTQ1LTE5cS0xOS0xOS0xOS00NXYtMjU2aC0yMjRxLTk4IDAtMTc1LjUgNnQtMTU0IDIxLjVxLTc2LjUgMTUuNS0xMzMgNDIuNXQtMTA1LjUgNjkuNXEtNDkgNDIuNS04MCAxMDF0LTQ4LjUgMTM4LjVxLTE3LjUgODAtMTcuNSAxODEgMCA1NSA1IDEyMyAwIDYgMi41IDIzLjV0Mi41IDI2LjVxMCAxNS04LjUgMjV0LTIzLjUgMTBxLTE2IDAtMjgtMTctNy05LTEzLTIydC0xMy41LTMwcS03LjUtMTctMTAuNS0yNC0xMjctMjg1LTEyNy00NTEgMC0xOTkgNTMtMzMzIDE2Mi00MDMgODc1LTQwM2gyMjR2LTI1NnEwLTI2IDE5LTQ1dDQ1LTE5cTI2IDAgNDUgMTlsNTEyIDUxMnExOSAxOSAxOSA0NXoiLz48L3N2Zz4=");
}

.svg-step-backward button,
button.svg-step-backward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDIwNDhxMCAxNjYtMTI3IDQ1MS0zIDctMTAuNSAyNHQtMTMuNSAzMHEtNiAxMy0xMyAyMi0xMiAxNy0yOCAxNy0xNSAwLTIzLjUtMTB0LTguNS0yNXEwLTkgMi41LTI2LjV0Mi41LTIzLjVxNS02OCA1LTEyMyAwLTEwMS0xNy41LTE4MXQtNDguNS0xMzguNXEtMzEtNTguNS04MC0xMDF0LTEwNS41LTY5LjVxLTU2LjUtMjctMTMzLTQyLjV0LTE1NC0yMS41cS03Ny41LTYtMTc1LjUtNmgtMjI0djI1NnEwIDI2LTE5IDQ1dC00NSAxOXEtMjYgMC00NS0xOWwtNTEyLTUxMnEtMTktMTktMTktNDV0MTktNDVsNTEyLTUxMnExOS0xOSA0NS0xOXQ0NSAxOXExOSAxOSAxOSA0NXYyNTZoMjI0cTcxMyAwIDg3NSA0MDMgNTMgMTM0IDUzIDMzM3oiLz48L3N2Zz4=");
}

.svg-pause button,
button.svg-pause {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNTYwIDEwODh2MTQwOHEwIDI2LTE5IDQ1dC00NSAxOWgtNTEycS0yNiAwLTQ1LTE5dC0xOS00NVYxMDg4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6bS04OTYgMHYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWg1MTJxMjYgMCA0NSAxOXQxOSA0NXoiLz48L3N2Zz4=");
}

.svg-play button,
button.svg-play {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNDcyLjUgMTgyM2wtMTMyOCA3MzhxLTIzIDEzLTM5LjUgM3QtMTYuNS0zNlYxMDU2cTAtMjYgMTYuNS0zNnQzOS41IDNsMTMyOCA3MzhxMjMgMTMgMjMgMzF0LTIzIDMxeiIvPjwvc3ZnPg==");
}

.svg-enter-fullscreen button,
button.svg-enter-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTkgMTZIN3Y1aDV2LTJIOXYtM3ptLTItNGgyVjloM1Y3SDd2NXptMTIgN2gtM3YyaDV2LTVoLTJ2M3pNMTYgN3YyaDN2M2gyVjdoLTV6Ii8+PC9zdmc+");
}

.svg-exit-fullscreen button,
button.svg-exit-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTcgMThoM3YzaDJ2LTVIN3Yyem0zLThIN3YyaDVWN2gtMnYzem02IDExaDJ2LTNoM3YtMmgtNXY1em0yLTExVjdoLTJ2NWg1di0yaC0zeiIvPjwvc3ZnPg==");
}

.svg-twizzle-tw button,
button.svg-twizzle-tw {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODY0IiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzk3LjU4MSAxNTEuMTh2NTcuMDg0aC04OS43MDN2MjQwLjM1MmgtNjYuOTU1VjIwOC4yNjRIMTUxLjIydi01Ny4wODNoMjQ2LjM2MXptNTQuMzEgNzEuNjc3bDcuNTEyIDMzLjY5MmMyLjcxOCAxMi4xNiA1LjU4IDI0LjY4IDguNTg0IDM3LjU1NWEyMTgwLjc3NSAyMTgwLjc3NSAwIDAwOS40NDIgMzguODQzIDEyNjYuMyAxMjY2LjMgMCAwMDEwLjA4NiAzNy41NTVjMy43Mi0xMi41OSA3LjM2OC0yNS40NjYgMTAuOTQ1LTM4LjYyOCAzLjU3Ni0xMy4xNjIgNy4wMS0yNi4xMSAxMC4zLTM4Ljg0M2w1Ljc2OS0yMi40NTZjMS4yNDgtNC44ODcgMi40NzItOS43MDUgMy42NzQtMTQuNDU1IDMuMDA0LTExLjg3NSA1LjY1MS0yMi45NjIgNy45NC0zMy4yNjNoNDYuMzU0bDIuMzg0IDEwLjU2M2EyMDAwLjc3IDIwMDAuNzcgMCAwMDMuOTM1IDE2LjgyOGw2LjcxMSAyNy43MWMxLjIxMyA0Ljk1NiAyLjQ1IDkuOTggMy43MDkgMTUuMDczYTMxMTkuNzc3IDMxMTkuNzc3IDAgMDA5Ljg3MSAzOC44NDMgMTI0OS4yMjcgMTI0OS4yMjcgMCAwMDEwLjczIDM4LjYyOCAxOTA3LjYwNSAxOTA3LjYwNSAwIDAwMTAuMzAxLTM3LjU1NSAxMzk3Ljk0IDEzOTcuOTQgMCAwMDkuNjU3LTM4Ljg0M2w0LjQtMTkuMDQ2Yy43MTUtMy4xMyAxLjQyMS02LjIzNiAyLjExOC05LjMyMWw5LjU3Ny00Mi44OGg2Ni41MjZhMjk4OC43MTggMjk4OC43MTggMCAwMS0xOS41MjkgNjYuMzExbC01LjcyOCAxOC40ODJhMzIzNy40NiAzMjM3LjQ2IDAgMDEtMTQuMDE1IDQzLjc1MmMtNi40MzggMTkuNi0xMi43MzMgMzcuNjk4LTE4Ljg4NSA1NC4yOTRsLTMuMzA2IDguODI1Yy00Ljg4NCAxMi44OTgtOS40MzMgMjQuMjYzLTEzLjY0NyAzNC4wOTVoLTQ5Ljc4N2E4NDE3LjI4OSA4NDE3LjI4OSAwIDAxLTIxLjAzMS02NC44MDkgMTI4OC42ODYgMTI4OC42ODYgMCAwMS0xOC44ODUtNjQuODEgMTk3Mi40NDQgMTk3Mi40NDQgMCAwMS0xOC4yNCA2NC44MSAyNTc5LjQxMiAyNTc5LjQxMiAwIDAxLTIwLjM4OCA2NC44MWgtNDkuNzg3Yy00LjY4Mi0xMC45MjYtOS43Mi0yMy43NDMtMTUuMTEtMzguNDUxbC0xLjYyOS00LjQ3Yy01LjI1OC0xNC41MjEtMTAuNjgtMzAuMTkyLTE2LjI2Ni00Ny4wMTRsLTIuNDA0LTcuMjhjLTYuNDM4LTE5LjYtMTMuMDItNDAuMzQ0LTE5Ljc0My02Mi4yMzRhMjk4OC43MDcgMjk4OC43MDcgMCAwMS0xOS41MjktNjYuMzExaDY3LjM4NXoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg==");
}
`),
  ie = typeof document > "u" ? null : document,
  nr = ie?.fullscreenEnabled || !!ie?.webkitFullscreenEnabled;
function ar() {
  return document.exitFullscreen
    ? document.exitFullscreen()
    : document.webkitExitFullscreen();
}
function Ut() {
  return document.fullscreenElement
    ? document.fullscreenElement
    : document.webkitFullscreenElement ?? null;
}
function or(e) {
  return e.requestFullscreen
    ? e.requestFullscreen()
    : e.webkitRequestFullscreen();
}
var lr = [
    "skip-to-start",
    "skip-to-end",
    "step-forward",
    "step-backward",
    "pause",
    "play",
    "enter-fullscreen",
    "exit-fullscreen",
    "twizzle-tw",
  ],
  cr = class extends f {
    derive(e) {
      return {
        fullscreen: {
          enabled: nr,
          icon:
            document.fullscreenElement === null
              ? "enter-fullscreen"
              : "exit-fullscreen",
          title: "Enter fullscreen",
        },
        "jump-to-start": {
          enabled: !e.coarseTimelineInfo.atStart,
          icon: "skip-to-start",
          title: "Restart",
        },
        "play-step-backwards": {
          enabled: !e.coarseTimelineInfo.atStart,
          icon: "step-backward",
          title: "Step backward",
        },
        "play-pause": {
          enabled: !(
            e.coarseTimelineInfo.atStart && e.coarseTimelineInfo.atEnd
          ),
          icon: e.coarseTimelineInfo.playing ? "pause" : "play",
          title: e.coarseTimelineInfo.playing ? "Pause" : "Play",
        },
        "play-step": {
          enabled: !e.coarseTimelineInfo.atEnd,
          icon: "step-forward",
          title: "Step forward",
        },
        "jump-to-end": {
          enabled: !e.coarseTimelineInfo.atEnd,
          icon: "skip-to-end",
          title: "Skip to End",
        },
        "twizzle-link": {
          enabled: !0,
          icon: "twizzle-tw",
          title: "View at Twizzle",
          hidden: e.viewerLink === "none",
        },
      };
    }
  },
  Ft = {
    fullscreen: !0,
    "jump-to-start": !0,
    "play-step-backwards": !0,
    "play-pause": !0,
    "play-step": !0,
    "jump-to-end": !0,
    "twizzle-link": !0,
  },
  Je,
  Ii,
  ui,
  Ti =
    ((ui = class extends k {
      constructor(t, i, r) {
        super();
        c(this, Je);
        (this.model = t),
          (this.controller = i),
          (this.fullscreenElement = r),
          (this.buttons = null);
      }
      connectedCallback() {
        this.addCSS(rr);
        let t = {};
        for (let i in Ft) {
          let r = new Si();
          (t[i] = r),
            r.htmlButton.addEventListener("click", () =>
              j(this, Je, Ii).call(this, i)
            ),
            this.addElement(r);
        }
        (this.buttons = t),
          this.model?.buttonAppearance.addFreshListener(this.update.bind(this));
      }
      async onFullscreenButton() {
        if (!this.fullscreenElement)
          throw new Error("Attempted to go fullscreen without an element.");
        if (Ut() === this.fullscreenElement) ar();
        else {
          this.buttons?.fullscreen.setIcon("exit-fullscreen"),
            or(this.fullscreenElement);
          let t = () => {
            Ut() !== this.fullscreenElement &&
              (this.buttons?.fullscreen.setIcon("enter-fullscreen"),
              window.removeEventListener("fullscreenchange", t));
          };
          window.addEventListener("fullscreenchange", t);
        }
      }
      async update(t) {
        for (let i in Ft) {
          let r = this.buttons[i],
            s = t[i];
          (r.htmlButton.disabled = !s.enabled),
            (r.htmlButton.title = s.title),
            r.setIcon(s.icon),
            (r.hidden = !!s.hidden);
        }
      }
    }),
    (Je = new WeakSet()),
    (Ii = function (t) {
      switch (t) {
        case "fullscreen": {
          this.onFullscreenButton();
          break;
        }
        case "jump-to-start": {
          this.controller?.jumpToStart({ flash: !0 });
          break;
        }
        case "play-step-backwards": {
          this.controller?.animationController.play({
            direction: -1,
            untilBoundary: "move",
          });
          break;
        }
        case "play-pause": {
          this.controller?.togglePlay();
          break;
        }
        case "play-step": {
          this.controller?.animationController.play({
            direction: 1,
            untilBoundary: "move",
          });
          break;
        }
        case "jump-to-end": {
          this.controller?.jumpToEnd({ flash: !0 });
          break;
        }
        case "twizzle-link": {
          this.controller?.visitTwizzleLink();
          break;
        }
        default:
          throw new Error("Missing command");
      }
    }),
    ui);
T.define("twisty-buttons", Ti);
var Ne,
  hi,
  Si =
    ((hi = class extends k {
      constructor() {
        super(...arguments);
        c(this, Ne, void 0);
        (this.htmlButton = document.createElement("button")),
          u(this, Ne, new it(this, "svg-", lr));
      }
      connectedCallback() {
        this.addCSS(sr), this.addElement(this.htmlButton);
      }
      setIcon(t) {
        a(this, Ne).setValue(t);
      }
    }),
    (Ne = new WeakMap()),
    hi);
T.define("twisty-button", Si);
var dr = new C(`
:host {
  width: 384px;
  height: 16px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(196, 196, 196, 0.75)
}

input:not(:disabled) {
  cursor: ew-resize;
}
`),
  ur = !1,
  Ge = !1;
ie?.addEventListener(
  "mousedown",
  function (e) {
    e.which && (Ge = !0);
  },
  !0
);
ie?.addEventListener(
  "mouseup",
  function (e) {
    e.which && (Ge = !1);
  },
  !0
);
var yt = 0,
  Ye = 0;
ie?.addEventListener(
  "mousedown",
  () => {
    Ye++;
  },
  !1
);
ie?.addEventListener("mousemove", ki, !1);
ie?.addEventListener("mouseenter", ki, !1);
function ki(e) {
  yt = e.pageY;
}
var Bt = 0,
  Wt = 0,
  mt = !1,
  pt = 0,
  Pe,
  mi,
  bi =
    ((mi = class extends k {
      constructor(t, i) {
        super();
        c(this, Pe, null);
        (this.model = t), (this.controller = i);
      }
      async onDetailedTimelineInfo(t) {
        let i = await this.inputElem();
        (i.min = t.timeRange.start.toString()),
          (i.max = t.timeRange.end.toString()),
          (i.disabled = i.min === i.max),
          (i.value = t.timestamp.toString());
      }
      async connectedCallback() {
        this.addCSS(dr), this.addElement(await this.inputElem());
      }
      async inputElem() {
        return (
          a(this, Pe) ??
          u(
            this,
            Pe,
            (async () => {
              let t = document.createElement("input");
              return (
                (t.type = "range"),
                (t.disabled = !0),
                this.model?.detailedTimelineInfo.addFreshListener(
                  this.onDetailedTimelineInfo.bind(this)
                ),
                t.addEventListener("input", this.onInput.bind(this)),
                t.addEventListener("keydown", this.onKeypress.bind(this)),
                t
              );
            })()
          )
        );
      }
      async onInput(t) {
        if (mt) return;
        let i = await this.inputElem();
        await this.slowDown(t, i);
        let r = parseInt(i.value);
        this.model?.playingInfo.set({ playing: !1 }),
          this.model?.timestampRequest.set(r);
      }
      onKeypress(t) {
        switch (t.key) {
          case "ArrowLeft":
          case "ArrowRight": {
            this.controller?.animationController.play({
              direction: t.key === "ArrowLeft" ? -1 : 1,
              untilBoundary: "move",
            }),
              t.preventDefault();
            break;
          }
          case " ": {
            this.controller?.togglePlay(), t.preventDefault();
            break;
          }
        }
      }
      async slowDown(t, i) {
        if (ur && Ge) {
          let r = i.getBoundingClientRect(),
            s = r.top + r.height / 2;
          console.log(s, t, yt, Ge);
          let n = Math.abs(s - yt),
            o = 1;
          n > 64 && (o = Math.max(Math.pow(2, -(n - 64) / 64), 1 / 32));
          let l = parseInt(i.value);
          if ((console.log("cl", pt, Ye, l), pt === Ye)) {
            let m = (l - Wt) * o;
            console.log("delta", m, n), (mt = !0);
            let h = l;
            (h =
              Bt +
              m * o +
              (l - Bt) * Math.min(1, Math.pow(1 / 2, (n * n) / 64))),
              (i.value = h.toString()),
              console.log(o),
              (mt = !1),
              (this.contentWrapper.style.opacity = o.toString());
          } else pt = Ye;
          Wt = l;
        }
      }
    }),
    (Pe = new WeakMap()),
    mi);
T.define("twisty-scrubber", bi);
var qt = null;
async function Ht(e, t) {
  let [{ PerspectiveCamera: i, Scene: r }, s, n, o, l, m, h] =
      await Promise.all([
        Z,
        await e.puzzleLoader.get(),
        await e.visualizationStrategy.get(),
        await e.twistySceneModel.stickeringRequest.get(),
        await e.twistySceneModel.stickeringMaskRequest.get(),
        await e.legacyPosition.get(),
        await e.twistySceneModel.orbitCoordinates.get(),
      ]),
    v = t?.width ?? 2048,
    p = t?.height ?? 2048,
    z = v / p,
    L = qt ?? (qt = await (async () => new i(20, z, 0.1, 20))()),
    I = new r(),
    W = new Li(e, { scheduleRender: () => {} }, s, n);
  I.add(await W.twisty3DPuzzle()), await Et(L, h);
  let zt = (await Ct(v, p, I, L)).toDataURL(),
    Bi = await Di(e);
  return {
    dataURL: zt,
    download: async (Wi) => {
      Ci(zt, Wi ?? Bi);
    },
  };
}
async function Di(e) {
  let [t, i] = await Promise.all([e.puzzleID.get(), e.alg.get()]);
  return `[${t}]${
    i.alg.experimentalNumChildAlgNodes() === 0 ? "" : ` ${i.alg.toString()}`
  }`;
}
function Ci(e, t, i = "png") {
  let r = document.createElement("a");
  (r.href = e), (r.download = `${t}.${i}`), r.click();
}
var hr = new C(`
:host {
  width: 384px;
  height: 256px;
  display: grid;

  -webkit-user-select: none;
  user-select: none;
}

.wrapper {
  display: grid;
  overflow: hidden;
  contain: size;
  grid-template-rows: 7fr minmax(1.5em, 0.5fr) minmax(2em, 1fr);
}

.wrapper > * {
  width: inherit;
  height: inherit;
  overflow: hidden;
}

.wrapper.controls-none {
  grid-template-rows: 7fr;
}

.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-control-button-panel ,
.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-buttons {
  display: none;
}

twisty-scrubber {
  background: rgba(196, 196, 196, 0.5);
}

.wrapper.checkered {
  background-color: #EAEAEA;
  background-image: linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD),
    linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD);
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
}

.visualization-wrapper > * {
  width: 100%;
  height: 100%;
}

.error-elem {
  width: 100%;
  height: 100%;
  display: none;
  place-content: center;
  font-family: sans-serif;
  box-shadow: inset 0 0 2em rgb(255, 0, 0);
  color: red;
  text-shadow: 0 0 0.2em white;
  background: rgba(255, 255, 255, 0.25);
}

.wrapper.error .visualization-wrapper {
  display: none;
}

.wrapper.error .error-elem {
  display: grid;
}
`),
  Qt = class extends w {
    getDefaultValue() {
      return null;
    }
  },
  Mt = class extends q {
    getDefaultValue() {
      return null;
    }
    derive(e) {
      return typeof e == "string" ? new URL(e, location.href) : e;
    }
  },
  ve = class {
    constructor(e) {
      (this.warnings = Object.freeze(e?.warnings ?? [])),
        (this.errors = Object.freeze(e?.errors ?? [])),
        Object.freeze(this);
    }
    add(e) {
      return new ve({
        warnings: this.warnings.concat(e?.warnings ?? []),
        errors: this.errors.concat(e?.errors ?? []),
      });
    }
    log() {
      this.errors.length > 0
        ? console.error(`\u{1F6A8} ${this.errors[0]}`)
        : this.warnings.length > 0
        ? console.warn(`\u26A0\uFE0F ${this.warnings[0]}`)
        : console.info("\u{1F60E} No issues!");
    }
  };
function Ei(e) {
  try {
    let t = A.fromString(e),
      i = [];
    return (
      t.toString() !== e && i.push("Alg is non-canonical!"),
      { alg: t, issues: new ve({ warnings: i }) }
    );
  } catch (t) {
    return {
      alg: new A(),
      issues: new ve({ errors: [`Malformed alg: ${t.toString()}`] }),
    };
  }
}
function mr(e, t) {
  return (
    e.alg.isIdentical(t.alg) &&
    ft(e.issues.warnings, t.issues.warnings) &&
    ft(e.issues.errors, t.issues.errors)
  );
}
var Yt = class extends q {
    getDefaultValue() {
      return { alg: new A(), issues: new ve() };
    }
    canReuseValue(e, t) {
      return mr(e, t);
    }
    async derive(e) {
      return typeof e == "string" ? Ei(e) : { alg: e, issues: new ve() };
    }
  },
  pr = class extends f {
    derive(e) {
      return e.kpuzzle.algToTransformation(e.setupAlg.alg);
    }
  },
  gr = class extends f {
    derive(e) {
      if (e.setupTransformation) return e.setupTransformation;
      switch (e.setupAnchor) {
        case "start":
          return e.setupAlgTransformation;
        case "end": {
          let i = e.indexer
            .transformationAtIndex(e.indexer.numAnimatedLeaves())
            .invert();
          return e.setupAlgTransformation.applyTransformation(i);
        }
        default:
          throw new Error("Unimplemented!");
      }
    }
  },
  fr = class extends w {
    getDefaultValue() {
      return { move: null, amount: 0 };
    }
    canReuseValue(e, t) {
      return e.move === t.move && e.amount === t.amount;
    }
  },
  wr = class extends f {
    derive(e) {
      return {
        stateIndex: e.currentMoveInfo.stateIndex,
        movesFinishing: e.currentMoveInfo.movesFinishing.map((t) => t.move),
        movesFinished: e.currentMoveInfo.movesFinished.map((t) => t.move),
      };
    }
    canReuseValue(e, t) {
      return (
        e.stateIndex === t.stateIndex &&
        Rt(e.movesFinishing, t.movesFinishing, (i, r) => i.isIdentical(r)) &&
        Rt(e.movesFinished, t.movesFinished, (i, r) => i.isIdentical(r))
      );
    }
  },
  vr = class extends f {
    derive(e) {
      function t(i) {
        return (
          e.detailedTimelineInfo.atEnd &&
            e.catchUpMove.move !== null &&
            i.currentMoves.push({
              move: e.catchUpMove.move,
              direction: -1,
              fraction: 1 - e.catchUpMove.amount,
              startTimestamp: -1,
              endTimestamp: -1,
            }),
          i
        );
      }
      if (e.indexer.currentMoveInfo)
        return t(e.indexer.currentMoveInfo(e.detailedTimelineInfo.timestamp));
      {
        let i = e.indexer.timestampToIndex(e.detailedTimelineInfo.timestamp),
          r = {
            stateIndex: i,
            currentMoves: [],
            movesFinishing: [],
            movesFinished: [],
            movesStarting: [],
            latestStart: -1 / 0,
            earliestEnd: 1 / 0,
          };
        if (e.indexer.numAnimatedLeaves() > 0) {
          let s = e.indexer.getAnimLeaf(i)?.as(d);
          if (!s) return t(r);
          let n = e.indexer.indexToMoveStartTimestamp(i),
            o = e.indexer.moveDuration(i),
            l = o ? (e.detailedTimelineInfo.timestamp - n) / o : 0,
            m = n + o,
            h = {
              move: s,
              direction: 1,
              fraction: l,
              startTimestamp: n,
              endTimestamp: m,
            };
          l === 0
            ? r.movesStarting.push(h)
            : l === 1
            ? r.movesFinishing.push(h)
            : (r.currentMoves.push(h),
              (r.latestStart = Math.max(r.latestStart, n)),
              (r.earliestEnd = Math.min(r.earliestEnd, m)));
        }
        return t(r);
      }
    }
  },
  yr = class extends f {
    derive(e) {
      let t = e.indexer.transformationAtIndex(
        e.currentLeavesSimplified.stateIndex
      );
      t = e.anchoredStart.applyTransformation(t);
      for (let i of e.currentLeavesSimplified.movesFinishing)
        t = t.applyMove(i);
      for (let i of e.currentLeavesSimplified.movesFinished) t = t.applyMove(i);
      return t.toKState();
    }
  };
function $(e) {
  switch (Math.abs(e)) {
    case 0:
      return 0;
    case 1:
      return 1e3;
    case 2:
      return 1500;
    default:
      return 2e3;
  }
}
var Ni = class extends O {
    constructor(e = $) {
      super(), (this.durationForAmount = e);
    }
    traverseAlg(e) {
      let t = 0;
      for (let i of e.childAlgNodes()) t += this.traverseAlgNode(i);
      return t;
    }
    traverseGrouping(e) {
      return e.amount * this.traverseAlg(e.alg);
    }
    traverseMove(e) {
      return this.durationForAmount(e.amount);
    }
    traverseCommutator(e) {
      return 2 * (this.traverseAlg(e.A) + this.traverseAlg(e.B));
    }
    traverseConjugate(e) {
      return 2 * this.traverseAlg(e.A) + this.traverseAlg(e.B);
    }
    traversePause(e) {
      return this.durationForAmount(1);
    }
    traverseNewline(e) {
      return this.durationForAmount(1);
    }
    traverseLineComment(e) {
      return this.durationForAmount(0);
    }
  },
  Mr = class {
    constructor(e, t) {
      (this.kpuzzle = e),
        (this.durationFn = new Ni($)),
        (this.moves = new A(t.experimentalExpand()));
    }
    getAnimLeaf(e) {
      return Array.from(this.moves.childAlgNodes())[e];
    }
    indexToMoveStartTimestamp(e) {
      let t = new A(Array.from(this.moves.childAlgNodes()).slice(0, e));
      return this.durationFn.traverseAlg(t);
    }
    timestampToIndex(e) {
      let t = 0,
        i;
      for (i = 0; i < this.numAnimatedLeaves(); i++)
        if (((t += this.durationFn.traverseMove(this.getAnimLeaf(i))), t >= e))
          return i;
      return i;
    }
    stateAtIndex(e) {
      return this.kpuzzle
        .startState()
        .applyTransformation(this.transformationAtIndex(e));
    }
    transformationAtIndex(e) {
      let t = this.kpuzzle.identityTransformation();
      for (let i of Array.from(this.moves.childAlgNodes()).slice(0, e))
        t = t.applyMove(i);
      return t;
    }
    algDuration() {
      return this.durationFn.traverseAlg(this.moves);
    }
    numAnimatedLeaves() {
      return Pt(this.moves);
    }
    moveDuration(e) {
      return this.durationFn.traverseMove(this.getAnimLeaf(e));
    }
  },
  _t = {
    u: "y",
    l: "x",
    f: "z",
    r: "x",
    b: "z",
    d: "y",
    m: "x",
    e: "y",
    s: "z",
    x: "x",
    y: "y",
    z: "z",
  };
function xr(e, t) {
  return _t[e.family[0].toLowerCase()] === _t[t.family[0].toLowerCase()];
}
var zr = class extends O {
    traverseAlg(e) {
      let t = [];
      for (let i of e.childAlgNodes()) t.push(this.traverseAlgNode(i));
      return Array.prototype.concat(...t);
    }
    traverseGroupingOnce(e) {
      if (e.experimentalIsEmpty()) return [];
      for (let s of e.childAlgNodes()) if (!s.is(d)) return this.traverseAlg(e);
      let t = Array.from(e.childAlgNodes()),
        i = $(t[0].amount);
      for (let s = 0; s < t.length - 1; s++) {
        for (let n = 1; n < t.length; n++)
          if (!xr(t[s], t[n])) return this.traverseAlg(e);
        i = Math.max(i, $(t[s].amount));
      }
      let r = t.map((s) => ({
        animLeafAlgNode: s,
        msUntilNext: 0,
        duration: i,
      }));
      return (r[r.length - 1].msUntilNext = i), r;
    }
    traverseGrouping(e) {
      let t = [],
        i = e.amount > 0 ? e.alg : e.alg.invert();
      for (let r = 0; r < Math.abs(e.amount); r++)
        t.push(this.traverseGroupingOnce(i));
      return Array.prototype.concat(...t);
    }
    traverseMove(e) {
      let t = $(e.amount);
      return [{ animLeafAlgNode: e, msUntilNext: t, duration: t }];
    }
    traverseCommutator(e) {
      let t = [],
        i = [e.A, e.B, e.A.invert(), e.B.invert()];
      for (let r of i) t.push(this.traverseGroupingOnce(r));
      return Array.prototype.concat(...t);
    }
    traverseConjugate(e) {
      let t = [],
        i = [e.A, e.B, e.A.invert()];
      for (let r of i) t.push(this.traverseGroupingOnce(r));
      return Array.prototype.concat(...t);
    }
    traversePause(e) {
      if (e.experimentalNISSGrouping) return [];
      let t = $(1);
      return [{ animLeafAlgNode: e, msUntilNext: t, duration: t }];
    }
    traverseNewline(e) {
      return [];
    }
    traverseLineComment(e) {
      return [];
    }
  },
  Ar = S(zr);
function Lr(e) {
  let t = 0;
  return Ar(e).map((r) => {
    let s = { animLeaf: r.animLeafAlgNode, start: t, end: t + r.duration };
    return (t += r.msUntilNext), s;
  });
}
var Tr = {
    "y' y' U' E D R2 r2 F2 B2 U E D' R2 L2' z2 S2 U U D D S2 F2' B2": [
      { animLeaf: new d("y", -1), start: 0, end: 1e3 },
      { animLeaf: new d("y", -1), start: 1e3, end: 2e3 },
      { animLeaf: new d("U", -1), start: 1e3, end: 1600 },
      { animLeaf: new d("E", 1), start: 1200, end: 1800 },
      { animLeaf: new d("D"), start: 1400, end: 2e3 },
      { animLeaf: new d("R", 2), start: 2e3, end: 3500 },
      { animLeaf: new d("r", 2), start: 2e3, end: 3500 },
      { animLeaf: new d("F", 2), start: 3500, end: 4200 },
      { animLeaf: new d("B", 2), start: 3800, end: 4500 },
      { animLeaf: new d("U", 1), start: 4500, end: 5500 },
      { animLeaf: new d("E", 1), start: 4500, end: 5500 },
      { animLeaf: new d("D", -1), start: 4500, end: 5500 },
      { animLeaf: new d("R", 2), start: 5500, end: 6500 },
      { animLeaf: new d("L", -2), start: 5500, end: 6500 },
      { animLeaf: new d("z", 2), start: 5500, end: 6500 },
      { animLeaf: new d("S", 2), start: 6500, end: 7500 },
      { animLeaf: new d("U"), start: 7500, end: 8e3 },
      { animLeaf: new d("D"), start: 7750, end: 8250 },
      { animLeaf: new d("U"), start: 8e3, end: 8500 },
      { animLeaf: new d("D"), start: 8250, end: 8750 },
      { animLeaf: new d("S", 2), start: 8750, end: 9250 },
      { animLeaf: new d("F", -2), start: 8750, end: 1e4 },
      { animLeaf: new d("B", 2), start: 8750, end: 1e4 },
    ],
    "M' R' U' D' M R": [
      { animLeaf: new d("M", -1), start: 0, end: 1e3 },
      { animLeaf: new d("R", -1), start: 0, end: 1e3 },
      { animLeaf: new d("U", -1), start: 1e3, end: 2e3 },
      { animLeaf: new d("D", -1), start: 1e3, end: 2e3 },
      { animLeaf: new d("M"), start: 2e3, end: 3e3 },
      { animLeaf: new d("R"), start: 2e3, end: 3e3 },
    ],
    "U' E' r E r2' E r U E": [
      { animLeaf: new d("U", -1), start: 0, end: 1e3 },
      { animLeaf: new d("E", -1), start: 0, end: 1e3 },
      { animLeaf: new d("r"), start: 1e3, end: 2500 },
      { animLeaf: new d("E"), start: 2500, end: 3500 },
      { animLeaf: new d("r", -2), start: 3500, end: 5e3 },
      { animLeaf: new d("E"), start: 5e3, end: 6e3 },
      { animLeaf: new d("r"), start: 6e3, end: 7e3 },
      { animLeaf: new d("U"), start: 7e3, end: 8e3 },
      { animLeaf: new d("E"), start: 7e3, end: 8e3 },
    ],
  },
  Gt = class {
    constructor(e, t) {
      (this.kpuzzle = e), (this.animLeaves = Tr[t.toString()] ?? Lr(t));
    }
    getAnimLeaf(e) {
      return (
        this.animLeaves[Math.min(e, this.animLeaves.length - 1)]?.animLeaf ??
        null
      );
    }
    getAnimLeafWithRange(e) {
      return this.animLeaves[Math.min(e, this.animLeaves.length - 1)];
    }
    indexToMoveStartTimestamp(e) {
      let t = 0;
      return (
        this.animLeaves.length > 0 &&
          (t = this.animLeaves[Math.min(e, this.animLeaves.length - 1)].start),
        t
      );
    }
    timestampToIndex(e) {
      let t = 0;
      for (t = 0; t < this.animLeaves.length; t++)
        if (this.animLeaves[t].start >= e) return Math.max(0, t - 1);
      return Math.max(0, t - 1);
    }
    timestampToPosition(e, t) {
      let i = this.currentMoveInfo(e),
        r = t ?? this.kpuzzle.identityTransformation().toKState();
      for (let s of this.animLeaves.slice(0, i.stateIndex)) {
        let n = s.animLeaf.as(d);
        n !== null && (r = r.applyMove(n));
      }
      return { state: r, movesInProgress: i.currentMoves };
    }
    currentMoveInfo(e) {
      let t = 1 / 0;
      for (let h of this.animLeaves)
        if (h.start <= e && h.end >= e) t = Math.min(t, h.start);
        else if (h.start > e) break;
      let i = [],
        r = [],
        s = [],
        n = [],
        o = -1 / 0,
        l = 1 / 0,
        m = 0;
      for (let h of this.animLeaves)
        if (h.end <= t) m++;
        else {
          if (h.start > e) break;
          {
            let v = h.animLeaf.as(d);
            if (v !== null) {
              let p = (e - h.start) / (h.end - h.start),
                z = !1;
              p > 1 && ((p = 1), (z = !0));
              let L = {
                move: v,
                direction: 1,
                fraction: p,
                startTimestamp: h.start,
                endTimestamp: h.end,
              };
              switch (p) {
                case 0: {
                  r.push(L);
                  break;
                }
                case 1: {
                  z ? n.push(L) : s.push(L);
                  break;
                }
                default:
                  i.push(L),
                    (o = Math.max(o, h.start)),
                    (l = Math.min(l, h.end));
              }
            }
          }
        }
      return {
        stateIndex: m,
        currentMoves: i,
        latestStart: o,
        earliestEnd: l,
        movesStarting: r,
        movesFinishing: s,
        movesFinished: n,
      };
    }
    stateAtIndex(e, t) {
      let i = t ?? this.kpuzzle.startState();
      for (let r = 0; r < this.animLeaves.length && r < e; r++) {
        let n = this.animLeaves[r].animLeaf.as(d);
        n !== null && (i = i.applyMove(n));
      }
      return i;
    }
    transformationAtIndex(e) {
      let t = this.kpuzzle.identityTransformation();
      for (let i of this.animLeaves.slice(0, e)) {
        let r = i.animLeaf.as(d);
        r !== null && (t = t.applyMove(r));
      }
      return t;
    }
    algDuration() {
      let e = 0;
      for (let t of this.animLeaves) e = Math.max(e, t.end);
      return e;
    }
    numAnimatedLeaves() {
      return this.animLeaves.length;
    }
    moveDuration(e) {
      let t = this.getAnimLeafWithRange(e);
      return t.end - t.start;
    }
  },
  X = class {
    constructor(e, t, i, r, s = []) {
      (this.moveCount = e),
        (this.duration = t),
        (this.forward = i),
        (this.backward = r),
        (this.children = s);
    }
  },
  Ir = class extends O {
    constructor(e) {
      super(),
        (this.kpuzzle = e),
        (this.durationFn = new Ni($)),
        (this.cache = {}),
        (this.identity = e.identityTransformation()),
        (this.dummyLeaf = new X(0, 0, this.identity, this.identity, []));
    }
    traverseAlg(e) {
      let t = 0,
        i = 0,
        r = this.identity,
        s = [];
      for (let n of e.childAlgNodes()) {
        let o = this.traverseAlgNode(n);
        (t += o.moveCount),
          (i += o.duration),
          r === this.identity
            ? (r = o.forward)
            : (r = r.applyTransformation(o.forward)),
          s.push(o);
      }
      return new X(t, i, r, r.invert(), s);
    }
    traverseGrouping(e) {
      let t = this.traverseAlg(e.alg);
      return this.mult(t, e.amount, [t]);
    }
    traverseMove(e) {
      let t = e.toString(),
        i = this.cache[t];
      if (i) return i;
      let r = this.kpuzzle.moveToTransformation(e);
      return (
        (i = new X(1, this.durationFn.traverseAlgNode(e), r, r.invert())),
        (this.cache[t] = i),
        i
      );
    }
    traverseCommutator(e) {
      let t = this.traverseAlg(e.A),
        i = this.traverseAlg(e.B),
        r = t.forward.applyTransformation(i.forward),
        s = t.backward.applyTransformation(i.backward),
        n = r.applyTransformation(s),
        o = new X(
          2 * (t.moveCount + i.moveCount),
          2 * (t.duration + i.duration),
          n,
          n.invert(),
          [t, i]
        );
      return this.mult(o, 1, [o, t, i]);
    }
    traverseConjugate(e) {
      let t = this.traverseAlg(e.A),
        i = this.traverseAlg(e.B),
        s = t.forward
          .applyTransformation(i.forward)
          .applyTransformation(t.backward),
        n = new X(
          2 * t.moveCount + i.moveCount,
          2 * t.duration + i.duration,
          s,
          s.invert(),
          [t, i]
        );
      return this.mult(n, 1, [n, t, i]);
    }
    traversePause(e) {
      return e.experimentalNISSGrouping
        ? this.dummyLeaf
        : new X(
            1,
            this.durationFn.traverseAlgNode(e),
            this.identity,
            this.identity
          );
    }
    traverseNewline(e) {
      return this.dummyLeaf;
    }
    traverseLineComment(e) {
      return this.dummyLeaf;
    }
    mult(e, t, i) {
      let r = Math.abs(t),
        s = e.forward.selfMultiply(t);
      return new X(e.moveCount * r, e.duration * r, s, s.invert(), i);
    }
  },
  x = class {
    constructor(e, t) {
      (this.apd = e), (this.back = t);
    }
  },
  Sr = class extends xe {
    constructor(e, t, i) {
      super(),
        (this.kpuzzle = e),
        (this.algOrAlgNode = t),
        (this.apd = i),
        (this.i = -1),
        (this.dur = -1),
        (this.goali = -1),
        (this.goaldur = -1),
        (this.move = void 0),
        (this.back = !1),
        (this.moveDuration = 0),
        (this.st = this.kpuzzle.identityTransformation()),
        (this.root = new x(this.apd, !1));
    }
    moveByIndex(e) {
      return this.i >= 0 && this.i === e
        ? this.move !== void 0
        : this.dosearch(e, 1 / 0);
    }
    moveByDuration(e) {
      return this.dur >= 0 && this.dur < e && this.dur + this.moveDuration >= e
        ? this.move !== void 0
        : this.dosearch(1 / 0, e);
    }
    dosearch(e, t) {
      return (
        (this.goali = e),
        (this.goaldur = t),
        (this.i = 0),
        (this.dur = 0),
        (this.move = void 0),
        (this.moveDuration = 0),
        (this.back = !1),
        (this.st = this.kpuzzle.identityTransformation()),
        this.algOrAlgNode.is(A)
          ? this.traverseAlg(this.algOrAlgNode, this.root)
          : this.traverseAlgNode(this.algOrAlgNode, this.root)
      );
    }
    traverseAlg(e, t) {
      if (!this.firstcheck(t)) return !1;
      let i = t.back ? e.experimentalNumChildAlgNodes() - 1 : 0;
      for (let r of Lt(e.childAlgNodes(), t.back ? -1 : 1)) {
        if (this.traverseAlgNode(r, new x(t.apd.children[i], t.back)))
          return !0;
        i += t.back ? -1 : 1;
      }
      return !1;
    }
    traverseGrouping(e, t) {
      if (!this.firstcheck(t)) return !1;
      let i = this.domult(t, e.amount);
      return this.traverseAlg(e.alg, new x(t.apd.children[0], i));
    }
    traverseMove(e, t) {
      return this.firstcheck(t)
        ? ((this.move = e),
          (this.moveDuration = t.apd.duration),
          (this.back = t.back),
          !0)
        : !1;
    }
    traverseCommutator(e, t) {
      if (!this.firstcheck(t)) return !1;
      let i = this.domult(t, 1);
      return i
        ? this.traverseAlg(e.B, new x(t.apd.children[2], !i)) ||
            this.traverseAlg(e.A, new x(t.apd.children[1], !i)) ||
            this.traverseAlg(e.B, new x(t.apd.children[2], i)) ||
            this.traverseAlg(e.A, new x(t.apd.children[1], i))
        : this.traverseAlg(e.A, new x(t.apd.children[1], i)) ||
            this.traverseAlg(e.B, new x(t.apd.children[2], i)) ||
            this.traverseAlg(e.A, new x(t.apd.children[1], !i)) ||
            this.traverseAlg(e.B, new x(t.apd.children[2], !i));
    }
    traverseConjugate(e, t) {
      if (!this.firstcheck(t)) return !1;
      let i = this.domult(t, 1);
      return i
        ? this.traverseAlg(e.A, new x(t.apd.children[1], !i)) ||
            this.traverseAlg(e.B, new x(t.apd.children[2], i)) ||
            this.traverseAlg(e.A, new x(t.apd.children[1], i))
        : this.traverseAlg(e.A, new x(t.apd.children[1], i)) ||
            this.traverseAlg(e.B, new x(t.apd.children[2], i)) ||
            this.traverseAlg(e.A, new x(t.apd.children[1], !i));
    }
    traversePause(e, t) {
      return this.firstcheck(t)
        ? ((this.move = e),
          (this.moveDuration = t.apd.duration),
          (this.back = t.back),
          !0)
        : !1;
    }
    traverseNewline(e, t) {
      return !1;
    }
    traverseLineComment(e, t) {
      return !1;
    }
    firstcheck(e) {
      return e.apd.moveCount + this.i <= this.goali &&
        e.apd.duration + this.dur < this.goaldur
        ? this.keepgoing(e)
        : !0;
    }
    domult(e, t) {
      let i = e.back;
      if (t === 0) return i;
      t < 0 && ((i = !i), (t = -t));
      let r = e.apd.children[0],
        s = Math.min(
          Math.floor((this.goali - this.i) / r.moveCount),
          Math.ceil((this.goaldur - this.dur) / r.duration - 1)
        );
      return s > 0 && this.keepgoing(new x(r, i), s), i;
    }
    keepgoing(e, t = 1) {
      return (
        (this.i += t * e.apd.moveCount),
        (this.dur += t * e.apd.duration),
        t !== 1
          ? e.back
            ? (this.st = this.st.applyTransformation(
                e.apd.backward.selfMultiply(t)
              ))
            : (this.st = this.st.applyTransformation(
                e.apd.forward.selfMultiply(t)
              ))
          : e.back
          ? (this.st = this.st.applyTransformation(e.apd.backward))
          : (this.st = this.st.applyTransformation(e.apd.forward)),
        !1
      );
    }
  },
  kr = 16;
function br(e, t) {
  let i = new Fe(),
    r = new Fe();
  for (let s of e.childAlgNodes())
    r.push(s),
      r.experimentalNumAlgNodes() >= t &&
        (i.push(new re(r.toAlg())), r.reset());
  return i.push(new re(r.toAlg())), i.toAlg();
}
var Dr = class extends O {
    traverseAlg(e) {
      let t = e.experimentalNumChildAlgNodes();
      return t < kr ? e : br(e, Math.ceil(Math.sqrt(t)));
    }
    traverseGrouping(e) {
      return new re(this.traverseAlg(e.alg), e.amount);
    }
    traverseMove(e) {
      return e;
    }
    traverseCommutator(e) {
      return new Be(this.traverseAlg(e.A), this.traverseAlg(e.B));
    }
    traverseConjugate(e) {
      return new Be(this.traverseAlg(e.A), this.traverseAlg(e.B));
    }
    traversePause(e) {
      return e;
    }
    traverseNewline(e) {
      return e;
    }
    traverseLineComment(e) {
      return e;
    }
  },
  Cr = S(Dr),
  Zt = class {
    constructor(e, t) {
      this.kpuzzle = e;
      let i = new Ir(this.kpuzzle),
        r = Cr(t);
      (this.decoration = i.traverseAlg(r)),
        (this.walker = new Sr(this.kpuzzle, r, this.decoration));
    }
    getAnimLeaf(e) {
      if (this.walker.moveByIndex(e)) {
        if (!this.walker.move) throw new Error("`this.walker.mv` missing");
        let t = this.walker.move;
        return this.walker.back ? t.invert() : t;
      }
      return null;
    }
    indexToMoveStartTimestamp(e) {
      if (this.walker.moveByIndex(e) || this.walker.i === e)
        return this.walker.dur;
      throw new Error(`Out of algorithm: index ${e}`);
    }
    indexToMovesInProgress(e) {
      if (this.walker.moveByIndex(e) || this.walker.i === e)
        return this.walker.dur;
      throw new Error(`Out of algorithm: index ${e}`);
    }
    stateAtIndex(e, t) {
      return (
        this.walker.moveByIndex(e),
        (t ?? this.kpuzzle.startState()).applyTransformation(this.walker.st)
      );
    }
    transformationAtIndex(e) {
      return this.walker.moveByIndex(e), this.walker.st;
    }
    numAnimatedLeaves() {
      return this.decoration.moveCount;
    }
    timestampToIndex(e) {
      return this.walker.moveByDuration(e), this.walker.i;
    }
    algDuration() {
      return this.decoration.duration;
    }
    moveDuration(e) {
      return this.walker.moveByIndex(e), this.walker.moveDuration;
    }
  },
  Er = class extends f {
    derive(e) {
      switch (e.indexerConstructorRequest) {
        case "auto":
          return ht(e.alg.alg) < 100 &&
            e.puzzle === "3x3x3" &&
            e.visualizationStrategy === "Cube3D"
            ? Gt
            : Zt;
        case "tree":
          return Zt;
        case "simple":
          return Mr;
        case "simultaneous":
          return Gt;
        default:
          throw new Error("Invalid indexer request!");
      }
    }
  },
  Nr = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  Pr = class extends f {
    derive(e) {
      return new e.indexerConstructor(e.kpuzzle, e.algWithIssues.alg);
    }
  },
  Rr = class extends f {
    derive(e) {
      return {
        state: e.state,
        movesInProgress: e.currentMoveInfo.currentMoves,
      };
    }
  },
  jr = class extends f {
    derive(e) {
      return e.alg.issues.errors.length > 0 ? null : ht(e.alg.alg);
    }
  },
  Or = !0,
  Xt = class extends f {
    async derive(e) {
      try {
        return (
          Or && e.kpuzzle.algToTransformation(e.algWithIssues.alg),
          e.algWithIssues
        );
      } catch (t) {
        return {
          alg: new A(),
          issues: new ve({
            errors: [`Invalid alg for puzzle: ${t.toString()}`],
          }),
        };
      }
    }
  },
  Vr = class extends w {
    getDefaultValue() {
      return "start";
    }
  },
  Ur = class extends w {
    getDefaultValue() {
      return null;
    }
  },
  Fr = class extends f {
    async derive(e) {
      return e.puzzleLoader.kpuzzle();
    }
  },
  Br = class extends w {
    getDefaultValue() {
      return se;
    }
  },
  Wr = class extends f {
    async derive(e) {
      return e.puzzleLoader.id;
    }
  },
  qr = class extends w {
    getDefaultValue() {
      return se;
    }
  },
  Hr = class extends f {
    derive(e) {
      if (e.puzzleIDRequest && e.puzzleIDRequest !== se) {
        let t = qe[e.puzzleIDRequest];
        return (
          t ||
            this.userVisibleErrorTracker.set({
              errors: [`Invalid puzzle ID: ${e.puzzleIDRequest}`],
            }),
          t
        );
      }
      return e.puzzleDescriptionRequest && e.puzzleDescriptionRequest !== se
        ? St(e.puzzleDescriptionRequest)
        : ot;
    }
  },
  Qr = class extends f {
    derive(e) {
      return {
        playing: e.playingInfo.playing,
        atStart: e.detailedTimelineInfo.atStart,
        atEnd: e.detailedTimelineInfo.atEnd,
      };
    }
    canReuseValue(e, t) {
      return (
        e.playing === t.playing &&
        e.atStart === t.atStart &&
        e.atEnd === t.atEnd
      );
    }
  },
  Ke,
  Pi,
  pi,
  Yr =
    ((pi = class extends f {
      constructor() {
        super(...arguments);
        c(this, Ke);
      }
      derive(t) {
        let i = j(this, Ke, Pi).call(this, t),
          r = !1,
          s = !1;
        return (
          i >= t.timeRange.end &&
            ((s = !0), (i = Math.min(t.timeRange.end, i))),
          i <= t.timeRange.start &&
            ((r = !0), (i = Math.max(t.timeRange.start, i))),
          { timestamp: i, timeRange: t.timeRange, atStart: r, atEnd: s }
        );
      }
      canReuseValue(t, i) {
        return (
          t.timestamp === i.timestamp &&
          t.timeRange.start === i.timeRange.start &&
          t.timeRange.end === i.timeRange.end &&
          t.atStart === i.atStart &&
          t.atEnd === i.atEnd
        );
      }
    }),
    (Ke = new WeakSet()),
    (Pi = function (t) {
      switch (t.timestampRequest) {
        case "start":
          return t.timeRange.start;
        case "end":
          return t.timeRange.end;
        case "anchor":
          return t.setupAnchor === "start"
            ? t.timeRange.start
            : t.timeRange.end;
        case "opposite-anchor":
          return t.setupAnchor === "start"
            ? t.timeRange.end
            : t.timeRange.start;
        default:
          return t.timestampRequest;
      }
    }),
    pi),
  _r = class extends q {
    async getDefaultValue() {
      return {
        direction: 1,
        playing: !1,
        untilBoundary: "entire-timeline",
        loop: !1,
      };
    }
    async derive(e, t) {
      let i = await t,
        r = Object.assign({}, i);
      return Object.assign(r, e), r;
    }
    canReuseValue(e, t) {
      return (
        e.direction === t.direction &&
        e.playing === t.playing &&
        e.untilBoundary === t.untilBoundary &&
        e.loop === t.loop
      );
    }
  },
  Gr = class extends q {
    getDefaultValue() {
      return 1;
    }
    derive(e) {
      return e < 0 ? 1 : e;
    }
  },
  Zr = { start: !0, end: !0, anchor: !0, "opposite-anchor": !0 },
  Xr = class extends w {
    getDefaultValue() {
      return "opposite-anchor";
    }
    set(e) {
      this.validInput(e) && super.set(e);
    }
    validInput(e) {
      return !!(typeof e == "number" || Zr[e]);
    }
  };
var $r = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  Jr = class extends f {
    derive(e) {
      return { start: 0, end: e.indexer.algDuration() };
    }
  },
  Kr = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  es = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  ts = class extends f {
    derive(e) {
      switch (e.puzzleID) {
        case "clock":
        case "square1":
        case "kilominx":
        case "redi_cube":
        case "melindas2x2x2x2":
          return "2D";
        case "3x3x3":
          switch (e.visualizationRequest) {
            case "auto":
            case "3D":
              return "Cube3D";
            default:
              return e.visualizationRequest;
          }
        default:
          switch (e.visualizationRequest) {
            case "auto":
            case "3D":
              return "PG3D";
            case "experimental-2D-LL":
              return e.puzzleID === "4x4x4" ? "experimental-2D-LL" : "2D";
            default:
              return e.visualizationRequest;
          }
      }
    }
  },
  is = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  rs = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  $t = null;
async function ss() {
  return $t ?? ($t = new (await Z).TextureLoader());
}
var Jt = class extends f {
    async derive(e) {
      let { spriteURL: t } = e;
      return t === null
        ? null
        : new Promise(async (i, r) => {
            let s = () => {
              console.warn("Could not load sprite:", t.toString()), i(null);
            };
            try {
              (await ss()).load(t.toString(), i, s, s);
            } catch {
              s();
            }
          });
    }
  },
  ns = { facelets: ["regular", "regular", "regular", "regular", "regular"] };
async function as(e) {
  let { definition: t } = await e.kpuzzle(),
    i = { orbits: {} };
  for (let [r, s] of Object.entries(t.orbits))
    i.orbits[r] = { pieces: new Array(s.numPieces).fill(ns) };
  return i;
}
var os = class extends f {
    getDefaultValue() {
      return { orbits: {} };
    }
    async derive(e) {
      return e.stickeringMaskRequest
        ? e.stickeringMaskRequest
        : e.stickeringRequest === "picture"
        ? { specialBehaviour: "picture", orbits: {} }
        : e.puzzleLoader.stickeringMask?.(e.stickeringRequest ?? "full") ??
          as(e.puzzleLoader);
    }
  },
  ls = {
    "-": "Regular",
    D: "Dim",
    I: "Ignored",
    X: "Invisible",
    O: "IgnoreNonPrimary",
    P: "PermuteNonPrimary",
    o: "Ignoriented",
    "?": "OrientationWithoutPermutation",
    "@": "Regular",
  };
function cs(e) {
  let t = { orbits: {} },
    i = e.split(",");
  for (let r of i) {
    let [s, n, ...o] = r.split(":");
    if (o.length > 0)
      throw new Error(
        `Invalid serialized orbit stickering mask (too many colons): \`${r}\``
      );
    let l = [];
    t.orbits[s] = { pieces: l };
    for (let m of n) {
      let h = ls[m];
      l.push(Tt(h));
    }
  }
  return t;
}
var ds = class extends q {
    getDefaultValue() {
      return null;
    }
    derive(e) {
      return e === null ? null : typeof e == "string" ? cs(e) : e;
    }
  },
  us = class extends w {
    getDefaultValue() {
      return null;
    }
  },
  hs = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  ms = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  ps = class extends w {
    getDefaultValue() {
      return {};
    }
  },
  gs = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  fs = class extends w {
    getDefaultValue() {
      return "auto";
    }
  },
  ws = 35,
  vs = class extends w {
    getDefaultValue() {
      return ws;
    }
  };
function Ri(e, t) {
  return (
    e.latitude === t.latitude &&
    e.longitude === t.longitude &&
    e.distance === t.distance
  );
}
var ys = class extends q {
    getDefaultValue() {
      return "auto";
    }
    canReuseValue(e, t) {
      return e === t || Ri(e, t);
    }
    async derive(e, t) {
      if (e === "auto") return "auto";
      let i = await t;
      i === "auto" && (i = {});
      let r = Object.assign({}, i);
      return (
        Object.assign(r, e),
        typeof r.latitude < "u" &&
          (r.latitude = Math.min(Math.max(r.latitude, -90), 90)),
        typeof r.longitude < "u" && (r.longitude = yi(r.longitude, 360, 180)),
        r
      );
    }
  },
  Ms = class extends f {
    canReuseValue(e, t) {
      return Ri(e, t);
    }
    async derive(e) {
      if (e.orbitCoordinatesRequest === "auto")
        return ei(e.puzzleID, e.strategy);
      let t = Object.assign(
        Object.assign({}, ei(e.puzzleID, e.strategy), e.orbitCoordinatesRequest)
      );
      if (Math.abs(t.latitude) <= e.latitudeLimit) return t;
      {
        let { latitude: i, longitude: r, distance: s } = t;
        return {
          latitude: e.latitudeLimit * Math.sign(i),
          longitude: r,
          distance: s,
        };
      }
    }
  },
  xs = {
    latitude: 31.717474411461005,
    longitude: 0,
    distance: 5.877852522924731,
  },
  zs = { latitude: 35, longitude: 30, distance: 6 },
  Kt = { latitude: 35, longitude: 30, distance: 6.25 },
  As = { latitude: Math.atan(1 / 2) * bt, longitude: 0, distance: 6.7 },
  Ls = { latitude: 26.56505117707799, longitude: 0, distance: 6 };
function ei(e, t) {
  if (e[1] === "x") return t === "Cube3D" ? zs : Kt;
  switch (e) {
    case "megaminx":
    case "gigaminx":
      return As;
    case "pyraminx":
    case "master_tetraminx":
      return Ls;
    case "skewb":
      return Kt;
    default:
      return xs;
  }
}
var Ts = class {
    constructor(e) {
      (this.twistyPlayerModel = e),
        (this.background = new fs()),
        (this.dragInput = new ms()),
        (this.foundationDisplay = new is()),
        (this.foundationStickerSpriteURL = new Mt()),
        (this.hintFacelet = new kt()),
        (this.hintStickerSpriteURL = new Mt()),
        (this.initialHintFaceletsAnimation = new rs()),
        (this.latitudeLimit = new vs()),
        (this.movePressInput = new gs()),
        (this.movePressCancelOptions = new ps()),
        (this.orbitCoordinatesRequest = new ys()),
        (this.stickeringMaskRequest = new ds()),
        (this.stickeringRequest = new us()),
        (this.faceletScale = new hs()),
        (this.foundationStickerSprite = new Jt({
          spriteURL: this.foundationStickerSpriteURL,
        })),
        (this.hintStickerSprite = new Jt({
          spriteURL: this.hintStickerSpriteURL,
        })),
        (this.orbitCoordinates = new Ms({
          orbitCoordinatesRequest: this.orbitCoordinatesRequest,
          latitudeLimit: this.latitudeLimit,
          puzzleID: e.puzzleID,
          strategy: e.visualizationStrategy,
        })),
        (this.stickeringMask = new os({
          stickeringMaskRequest: this.stickeringMaskRequest,
          stickeringRequest: this.stickeringRequest,
          puzzleLoader: e.puzzleLoader,
        }));
    }
  },
  Is = { errors: [] },
  Ss = class extends w {
    getDefaultValue() {
      return Is;
    }
    reset() {
      this.set(this.getDefaultValue());
    }
    canReuseValue(e, t) {
      return ft(e.errors, t.errors);
    }
  },
  ks = class {
    constructor() {
      (this.userVisibleErrorTracker = new Ss()),
        (this.alg = new Yt()),
        (this.backView = new $r()),
        (this.controlPanel = new $i()),
        (this.catchUpMove = new fr()),
        (this.indexerConstructorRequest = new Nr()),
        (this.playingInfo = new _r()),
        (this.puzzleDescriptionRequest = new Br()),
        (this.puzzleIDRequest = new qr()),
        (this.setupAnchor = new Vr()),
        (this.setupAlg = new Yt()),
        (this.setupTransformation = new Ur()),
        (this.tempoScale = new Gr()),
        (this.timestampRequest = new Xr()),
        (this.viewerLink = new Kr()),
        (this.visualizationFormat = new es()),
        (this.title = new Qt()),
        (this.videoURL = new Mt()),
        (this.competitionID = new Qt()),
        (this.puzzleLoader = new Hr(
          {
            puzzleIDRequest: this.puzzleIDRequest,
            puzzleDescriptionRequest: this.puzzleDescriptionRequest,
          },
          this.userVisibleErrorTracker
        )),
        (this.kpuzzle = new Fr({ puzzleLoader: this.puzzleLoader })),
        (this.puzzleID = new Wr({ puzzleLoader: this.puzzleLoader })),
        (this.puzzleAlg = new Xt({
          algWithIssues: this.alg,
          kpuzzle: this.kpuzzle,
        })),
        (this.puzzleSetupAlg = new Xt({
          algWithIssues: this.setupAlg,
          kpuzzle: this.kpuzzle,
        })),
        (this.visualizationStrategy = new ts({
          visualizationRequest: this.visualizationFormat,
          puzzleID: this.puzzleID,
        })),
        (this.indexerConstructor = new Er({
          alg: this.alg,
          puzzle: this.puzzleID,
          visualizationStrategy: this.visualizationStrategy,
          indexerConstructorRequest: this.indexerConstructorRequest,
        })),
        (this.moveCount = new jr({ alg: this.puzzleAlg })),
        (this.setupAlgTransformation = new pr({
          setupAlg: this.puzzleSetupAlg,
          kpuzzle: this.kpuzzle,
        })),
        (this.indexer = new Pr({
          indexerConstructor: this.indexerConstructor,
          algWithIssues: this.puzzleAlg,
          kpuzzle: this.kpuzzle,
        })),
        (this.anchorTransformation = new gr({
          setupTransformation: this.setupTransformation,
          setupAnchor: this.setupAnchor,
          setupAlgTransformation: this.setupAlgTransformation,
          indexer: this.indexer,
        })),
        (this.timeRange = new Jr({ indexer: this.indexer })),
        (this.detailedTimelineInfo = new Yr({
          timestampRequest: this.timestampRequest,
          timeRange: this.timeRange,
          setupAnchor: this.setupAnchor,
        })),
        (this.coarseTimelineInfo = new Qr({
          detailedTimelineInfo: this.detailedTimelineInfo,
          playingInfo: this.playingInfo,
        })),
        (this.currentMoveInfo = new vr({
          indexer: this.indexer,
          detailedTimelineInfo: this.detailedTimelineInfo,
          catchUpMove: this.catchUpMove,
        })),
        (this.buttonAppearance = new cr({
          coarseTimelineInfo: this.coarseTimelineInfo,
          viewerLink: this.viewerLink,
        })),
        (this.currentLeavesSimplified = new wr({
          currentMoveInfo: this.currentMoveInfo,
        })),
        (this.currentState = new yr({
          anchoredStart: this.anchorTransformation,
          currentLeavesSimplified: this.currentLeavesSimplified,
          indexer: this.indexer,
        })),
        (this.legacyPosition = new Rr({
          currentMoveInfo: this.currentMoveInfo,
          state: this.currentState,
        })),
        (this.twistySceneModel = new Ts(this));
    }
    async twizzleLink() {
      let [e, t, i, r, s, n, o] = await Promise.all([
          this.viewerLink.get(),
          this.puzzleID.get(),
          this.puzzleDescriptionRequest.get(),
          this.alg.get(),
          this.setupAlg.get(),
          this.setupAnchor.get(),
          this.twistySceneModel.stickeringRequest.get(),
        ]),
        l = e === "experimental-twizzle-explorer",
        m = new URL(`https://alpha.twizzle.net/${l ? "explore" : "edit"}/`);
      return (
        r.alg.experimentalIsEmpty() ||
          m.searchParams.set("alg", r.alg.toString()),
        s.alg.experimentalIsEmpty() ||
          m.searchParams.set("setup-alg", s.alg.toString()),
        n !== "start" && m.searchParams.set("setup-anchor", n),
        o !== "full" &&
          o !== null &&
          m.searchParams.set("experimental-stickering", o),
        l && i !== se
          ? m.searchParams.set("puzzle-description", i)
          : t !== "3x3x3" && m.searchParams.set("puzzle", t),
        m.toString()
      );
    }
    experimentalAddAlgLeaf(e, t) {
      let i = e.as(d);
      i
        ? this.experimentalAddMove(i, t)
        : this.alg.set(
            (async () => {
              let s = (await this.alg.get()).alg.concat(new A([e]));
              return this.timestampRequest.set("end"), s;
            })()
          );
    }
    experimentalAddMove(e, t) {
      let i = typeof e == "string" ? new d(e) : e;
      this.alg.set(
        (async () => {
          let [{ alg: r }, s] = await Promise.all([
              this.alg.get(),
              this.puzzleLoader.get(),
            ]),
            n = nt(r, i, { ...t, ...(await It(s)) });
          return (
            this.timestampRequest.set("end"),
            this.catchUpMove.set({ move: i, amount: 0 }),
            n
          );
        })()
      );
    }
    experimentalRemoveFinalChild() {
      this.alg.set(
        (async () => {
          let e = (await this.alg.get()).alg,
            t = Array.from(e.childAlgNodes()),
            [i] = t.splice(-1);
          if (!i) return e;
          this.timestampRequest.set("end");
          let r = i.as(d);
          return (
            r && this.catchUpMove.set({ move: r.invert(), amount: 0 }), new A(t)
          );
        })()
      );
    }
  };
function g(e) {
  return new Error(`Cannot get \`.${e}\` directly from a \`TwistyPlayer\`.`);
}
var bs = class extends k {
    constructor() {
      super(...arguments),
        (this.experimentalModel = new ks()),
        (this.experimentalGet = new Ds(this.experimentalModel));
    }
    set alg(e) {
      this.experimentalModel.alg.set(e);
    }
    get alg() {
      throw g("alg");
    }
    set experimentalSetupAlg(e) {
      this.experimentalModel.setupAlg.set(e);
    }
    get experimentalSetupAlg() {
      throw g("setup");
    }
    set experimentalSetupAnchor(e) {
      this.experimentalModel.setupAnchor.set(e);
    }
    get experimentalSetupAnchor() {
      throw g("anchor");
    }
    set puzzle(e) {
      this.experimentalModel.puzzleIDRequest.set(e);
    }
    get puzzle() {
      throw g("puzzle");
    }
    set experimentalPuzzleDescription(e) {
      this.experimentalModel.puzzleDescriptionRequest.set(e);
    }
    get experimentalPuzzleDescription() {
      throw g("experimentalPuzzleDescription");
    }
    set timestamp(e) {
      this.experimentalModel.timestampRequest.set(e);
    }
    get timestamp() {
      throw g("timestamp");
    }
    set hintFacelets(e) {
      this.experimentalModel.twistySceneModel.hintFacelet.set(e);
    }
    get hintFacelets() {
      throw g("hintFacelets");
    }
    set experimentalStickering(e) {
      this.experimentalModel.twistySceneModel.stickeringRequest.set(e);
    }
    get experimentalStickering() {
      throw g("experimentalStickering");
    }
    set experimentalStickeringMaskOrbits(e) {
      this.experimentalModel.twistySceneModel.stickeringMaskRequest.set(e);
    }
    get experimentalStickeringMaskOrbits() {
      throw g("experimentalStickeringMaskOrbits");
    }
    set experimentalFaceletScale(e) {
      this.experimentalModel.twistySceneModel.faceletScale.set(e);
    }
    get experimentalFaceletScale() {
      throw g("experimentalFaceletScale");
    }
    set backView(e) {
      this.experimentalModel.backView.set(e);
    }
    get backView() {
      throw g("backView");
    }
    set background(e) {
      this.experimentalModel.twistySceneModel.background.set(e);
    }
    get background() {
      throw g("background");
    }
    set controlPanel(e) {
      this.experimentalModel.controlPanel.set(e);
    }
    get controlPanel() {
      throw g("controlPanel");
    }
    set visualization(e) {
      this.experimentalModel.visualizationFormat.set(e);
    }
    get visualization() {
      throw g("visualization");
    }
    set experimentalTitle(e) {
      this.experimentalModel.title.set(e);
    }
    get experimentalTitle() {
      throw g("experimentalTitle");
    }
    set experimentalVideoURL(e) {
      this.experimentalModel.videoURL.set(e);
    }
    get experimentalVideoURL() {
      throw g("experimentalVideoURL");
    }
    set experimentalCompetitionID(e) {
      this.experimentalModel.competitionID.set(e);
    }
    get experimentalCompetitionID() {
      throw g("experimentalCompetitionID");
    }
    set viewerLink(e) {
      this.experimentalModel.viewerLink.set(e);
    }
    get viewerLink() {
      throw g("viewerLink");
    }
    set experimentalMovePressInput(e) {
      this.experimentalModel.twistySceneModel.movePressInput.set(e);
    }
    get experimentalMovePressInput() {
      throw g("experimentalMovePressInput");
    }
    set experimentalMovePressCancelOptions(e) {
      this.experimentalModel.twistySceneModel.movePressCancelOptions.set(e);
    }
    get experimentalMovePressCancelOptions() {
      throw g("experimentalMovePressCancelOptions");
    }
    set cameraLatitude(e) {
      this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
        latitude: e,
      });
    }
    get cameraLatitude() {
      throw g("cameraLatitude");
    }
    set cameraLongitude(e) {
      this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
        longitude: e,
      });
    }
    get cameraLongitude() {
      throw g("cameraLongitude");
    }
    set cameraDistance(e) {
      this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
        distance: e,
      });
    }
    get cameraDistance() {
      throw g("cameraDistance");
    }
    set cameraLatitudeLimit(e) {
      this.experimentalModel.twistySceneModel.latitudeLimit.set(e);
    }
    get cameraLatitudeLimit() {
      throw g("cameraLatitudeLimit");
    }
    set indexer(e) {
      this.experimentalModel.indexerConstructorRequest.set(e);
    }
    get indexer() {
      throw g("indexer");
    }
    set tempoScale(e) {
      this.experimentalModel.tempoScale.set(e);
    }
    get tempoScale() {
      throw g("tempoScale");
    }
    set experimentalSprite(e) {
      this.experimentalModel.twistySceneModel.foundationStickerSpriteURL.set(e);
    }
    get experimentalSprite() {
      throw g("experimentalSprite");
    }
    set experimentalHintSprite(e) {
      this.experimentalModel.twistySceneModel.hintStickerSpriteURL.set(e);
    }
    get experimentalHintSprite() {
      throw g("experimentalHintSprite");
    }
    set experimentalInitialHintFaceletsAnimation(e) {
      this.experimentalModel.twistySceneModel.initialHintFaceletsAnimation.set(
        e
      );
    }
    get experimentalInitialHintFaceletsAnimation() {
      throw g("experimentalInitialHintFaceletsAnimation");
    }
    set experimentalDragInput(e) {
      this.experimentalModel.twistySceneModel.dragInput.set(e);
    }
    get experimentalDragInput() {
      throw g("experimentalDragInput");
    }
  },
  Ds = class {
    constructor(e) {
      this.model = e;
    }
    async alg() {
      return (await this.model.alg.get()).alg;
    }
    async setupAlg() {
      return (await this.model.setupAlg.get()).alg;
    }
    puzzleID() {
      return this.model.puzzleID.get();
    }
    async timestamp() {
      return (await this.model.detailedTimelineInfo.get()).timestamp;
    }
  },
  gt = "data-",
  Ze = {
    alg: "alg",
    "experimental-setup-alg": "experimentalSetupAlg",
    "experimental-setup-anchor": "experimentalSetupAnchor",
    puzzle: "puzzle",
    "experimental-puzzle-description": "experimentalPuzzleDescription",
    visualization: "visualization",
    "hint-facelets": "hintFacelets",
    "experimental-stickering": "experimentalStickering",
    "experimental-stickering-mask-orbits": "experimentalStickeringMaskOrbits",
    background: "background",
    "control-panel": "controlPanel",
    "back-view": "backView",
    "experimental-initial-hint-facelets-animation":
      "experimentalInitialHintFaceletsAnimation",
    "viewer-link": "viewerLink",
    "experimental-move-press-input": "experimentalMovePressInput",
    "experimental-drag-input": "experimentalDragInput",
    "experimental-title": "experimentalTitle",
    "experimental-video-url": "experimentalVideoURL",
    "experimental-competition-id": "experimentalCompetitionID",
    "camera-latitude": "cameraLatitude",
    "camera-longitude": "cameraLongitude",
    "camera-distance": "cameraDistance",
    "camera-latitude-limit": "cameraLatitudeLimit",
    "tempo-scale": "tempoScale",
    "experimental-sprite": "experimentalSprite",
    "experimental-hint-sprite": "experimentalHintSprite",
  },
  Cs = Object.fromEntries(Object.values(Ze).map((e) => [e, !0])),
  Es = { experimentalMovePressCancelOptions: !0 },
  Re,
  ce,
  te,
  de,
  ue,
  E,
  he,
  me,
  et,
  ji,
  gi,
  ye =
    ((gi = class extends bs {
      constructor(t = {}) {
        super();
        c(this, et);
        c(this, Re, void 0);
        c(this, ce, void 0);
        c(this, te, void 0);
        c(this, de, void 0);
        c(this, ue, void 0);
        c(this, E, void 0);
        c(this, he, void 0);
        c(this, me, void 0);
        (this.controller = new Zi(this.experimentalModel, this)),
          (this.experimentalCanvasClickCallback = () => {}),
          u(
            this,
            Re,
            new it(this, "controls-", ["auto"].concat(Object.keys(Xi)))
          ),
          u(this, ce, document.createElement("div")),
          u(this, te, document.createElement("div")),
          u(this, de, !1),
          u(this, ue, "auto"),
          u(this, E, null),
          u(this, he, new Ai()),
          u(this, me, null);
        for (let [i, r] of Object.entries(t)) {
          if (!(Cs[i] || Es[i])) {
            console.warn(`Invalid config passed to TwistyPlayer: ${i}`);
            break;
          }
          this[i] = r;
        }
      }
      async connectedCallback() {
        if (a(this, de)) return;
        u(this, de, !0),
          this.addCSS(hr),
          this.addElement(a(this, ce)).classList.add("visualization-wrapper"),
          this.addElement(a(this, te)).classList.add("error-elem"),
          (a(this, te).textContent = "Error"),
          this.experimentalModel.userVisibleErrorTracker.addFreshListener(
            (i) => {
              let r = i.errors[0] ?? null;
              this.contentWrapper.classList.toggle("error", !!r),
                r && (a(this, te).textContent = r);
            }
          );
        let t = new bi(this.experimentalModel, this.controller);
        this.contentWrapper.appendChild(t),
          (this.buttons = new Ti(
            this.experimentalModel,
            this.controller,
            this
          )),
          this.contentWrapper.appendChild(this.buttons),
          this.experimentalModel.twistySceneModel.background.addFreshListener(
            (i) => {
              this.contentWrapper.classList.toggle("checkered", i !== "none");
            }
          ),
          this.experimentalModel.controlPanel.addFreshListener((i) => {
            a(this, Re).setValue(i);
          }),
          this.experimentalModel.visualizationStrategy.addFreshListener(
            j(this, et, ji).bind(this)
          ),
          this.experimentalModel.puzzleID.addFreshListener(
            this.flash.bind(this)
          );
      }
      experimentalSetFlashLevel(t) {
        u(this, ue, t);
      }
      flash() {
        a(this, ue) === "auto" &&
          a(this, E)?.animate([{ opacity: 0.25 }, { opacity: 1 }], {
            duration: 250,
            easing: "ease-out",
          });
      }
      async experimentalCurrentVantages() {
        this.connectedCallback();
        let t = a(this, E);
        return t instanceof vt ? t.experimentalVantages() : [];
      }
      async experimentalCurrentCanvases() {
        let t = await this.experimentalCurrentVantages(),
          i = [];
        for (let r of t) i.push((await r.canvasInfo()).canvas);
        return i;
      }
      async experimentalCurrentThreeJSPuzzleObject(t) {
        this.connectedCallback();
        let r = await (
            await a(this, he).promise
          ).experimentalTwisty3DPuzzleWrapper(),
          s = r.twisty3DPuzzle(),
          n = (async () => {
            await s, await new Promise((o) => setTimeout(o, 0));
          })();
        if (t) {
          let o = new ze(async () => {});
          r.addEventListener("render-scheduled", async () => {
            o.requestIsPending() || (o.requestAnimFrame(), await n, t());
          });
        }
        return s;
      }
      jumpToStart(t) {
        this.controller.jumpToStart(t);
      }
      jumpToEnd(t) {
        this.controller.jumpToEnd(t);
      }
      play() {
        this.controller.togglePlay(!0);
      }
      pause() {
        this.controller.togglePlay(!1);
      }
      togglePlay(t) {
        this.controller.togglePlay(t);
      }
      experimentalAddMove(t, i) {
        this.experimentalModel.experimentalAddMove(t, i);
      }
      experimentalAddAlgLeaf(t, i) {
        this.experimentalModel.experimentalAddAlgLeaf(t, i);
      }
      static get observedAttributes() {
        let t = [];
        for (let i of Object.keys(Ze)) t.push(i, gt + i);
        return t;
      }
      experimentalRemoveFinalChild() {
        this.experimentalModel.experimentalRemoveFinalChild();
      }
      attributeChangedCallback(t, i, r) {
        t.startsWith(gt) && (t = t.slice(gt.length));
        let s = Ze[t];
        s && (this[s] = r);
      }
      async experimentalScreenshot(t) {
        return (await Ht(this.experimentalModel, t)).dataURL;
      }
      async experimentalDownloadScreenshot(t) {
        if (
          ["2D", "experimental-2D-LL"].includes(
            await this.experimentalModel.visualizationStrategy.get()
          )
        ) {
          let r = await a(this, E)
              .currentTwisty2DPuzzleWrapper()
              .twisty2DPuzzle(),
            s = new XMLSerializer().serializeToString(r.svgWrapper.svgElement),
            n = URL.createObjectURL(new Blob([s]));
          Ci(n, t ?? (await Di(this.experimentalModel)), "svg");
        } else await (await Ht(this.experimentalModel)).download(t);
      }
    }),
    (Re = new WeakMap()),
    (ce = new WeakMap()),
    (te = new WeakMap()),
    (de = new WeakMap()),
    (ue = new WeakMap()),
    (E = new WeakMap()),
    (he = new WeakMap()),
    (me = new WeakMap()),
    (et = new WeakSet()),
    (ji = function (t) {
      if (t !== a(this, me)) {
        a(this, E)?.remove(), a(this, E)?.disconnect();
        let i;
        switch (t) {
          case "2D":
          case "experimental-2D-LL": {
            i = new zi(this.experimentalModel.twistySceneModel, t);
            break;
          }
          case "Cube3D":
          case "PG3D": {
            (i = new vt(this.experimentalModel)), a(this, he).handleNewValue(i);
            break;
          }
          default:
            throw new Error("Invalid visualization");
        }
        a(this, ce).appendChild(i), u(this, E, i), u(this, me, t);
      }
    }),
    gi);
T.define("twisty-player", ye);
var Ns = new C(`
:host {
  display: inline;
}

.wrapper {
  display: inline;
}

a:not(:hover) {
  color: inherit;
  text-decoration: none;
}

twisty-alg-leaf-elem.twisty-alg-comment {
  color: rgba(0, 0, 0, 0.4);
}

.wrapper.current-move {
  background: rgba(66, 133, 244, 0.3);
  margin-left: -0.1em;
  margin-right: -0.1em;
  padding-left: 0.1em;
  padding-right: 0.1em;
  border-radius: 0.1em;
}
`),
  Ps = 250,
  ae = class extends k {
    constructor(e, t, i, r, s, n) {
      if (
        (super({ mode: "open" }),
        (this.algOrAlgNode = r),
        this.classList.add(e),
        this.addCSS(Ns),
        n)
      ) {
        let o = this.contentWrapper.appendChild(document.createElement("a"));
        (o.href = "#"),
          (o.textContent = t),
          o.addEventListener("click", (l) => {
            l.preventDefault(),
              i.twistyAlgViewer.jumpToIndex(i.earliestMoveIndex, s);
          });
      } else
        this.contentWrapper.appendChild(
          document.createElement("span")
        ).textContent = t;
    }
    pathToIndex(e) {
      return [];
    }
    setCurrentMove(e) {
      this.contentWrapper.classList.toggle("current-move", e);
    }
  };
T.define("twisty-alg-leaf-elem", ae);
var oe = class extends ct {
  constructor(e, t) {
    super(), (this.algOrAlgNode = t), (this.queue = []), this.classList.add(e);
  }
  addString(e) {
    this.queue.push(document.createTextNode(e));
  }
  addElem(e) {
    return this.queue.push(e.element), e.moveCount;
  }
  flushQueue(e = 1) {
    for (let t of Oi(this.queue, e)) this.append(t);
    this.queue = [];
  }
  pathToIndex(e) {
    return [];
  }
};
T.define("twisty-alg-wrapper-elem", oe);
function Rs(e) {
  return e === 1 ? -1 : 1;
}
function js(e, t) {
  return t < 0 ? Rs(e) : e;
}
function Oi(e, t) {
  if (t === 1) return e;
  let i = Array.from(e);
  return i.reverse(), i;
}
var Os = class extends xe {
    traverseAlg(e, t) {
      let i = 0,
        r = new oe("twisty-alg-alg", e),
        s = !0;
      for (let n of At(e.childAlgNodes(), t.direction))
        s || r.addString(" "),
          (s = !1),
          n.as(We)?.experimentalNISSGrouping && r.addString("^("),
          n.as(re)?.experimentalNISSPlaceholder ||
            (i += r.addElem(
              this.traverseAlgNode(n, {
                earliestMoveIndex: t.earliestMoveIndex + i,
                twistyAlgViewer: t.twistyAlgViewer,
                direction: t.direction,
              })
            )),
          n.as(We)?.experimentalNISSGrouping && r.addString(")");
      return r.flushQueue(t.direction), { moveCount: i, element: r };
    }
    traverseGrouping(e, t) {
      let i = e.experimentalAsSquare1Tuple(),
        r = js(t.direction, e.amount),
        s = 0,
        n = new oe("twisty-alg-grouping", e);
      return (
        n.addString("("),
        i
          ? ((s += n.addElem({
              moveCount: 1,
              element: new ae(
                "twisty-alg-move",
                i[0].amount.toString(),
                t,
                i[0],
                !0,
                !0
              ),
            })),
            n.addString(", "),
            (s += n.addElem({
              moveCount: 1,
              element: new ae(
                "twisty-alg-move",
                i[1].amount.toString(),
                t,
                i[1],
                !0,
                !0
              ),
            })))
          : (s += n.addElem(
              this.traverseAlg(e.alg, {
                earliestMoveIndex: t.earliestMoveIndex + s,
                twistyAlgViewer: t.twistyAlgViewer,
                direction: r,
              })
            )),
        n.addString(`)${e.experimentalRepetitionSuffix}`),
        n.flushQueue(),
        { moveCount: s * Math.abs(e.amount), element: n }
      );
    }
    traverseMove(e, t) {
      let i = new ae("twisty-alg-move", e.toString(), t, e, !0, !0);
      return (
        t.twistyAlgViewer.highlighter.addMove(e.startCharIndex, i),
        { moveCount: 1, element: i }
      );
    }
    traverseCommutator(e, t) {
      let i = 0,
        r = new oe("twisty-alg-commutator", e);
      r.addString("["), r.flushQueue();
      let [s, n] = Oi([e.A, e.B], t.direction);
      return (
        (i += r.addElem(
          this.traverseAlg(s, {
            earliestMoveIndex: t.earliestMoveIndex + i,
            twistyAlgViewer: t.twistyAlgViewer,
            direction: t.direction,
          })
        )),
        r.addString(", "),
        (i += r.addElem(
          this.traverseAlg(n, {
            earliestMoveIndex: t.earliestMoveIndex + i,
            twistyAlgViewer: t.twistyAlgViewer,
            direction: t.direction,
          })
        )),
        r.flushQueue(t.direction),
        r.addString("]"),
        r.flushQueue(),
        { moveCount: i * 2, element: r }
      );
    }
    traverseConjugate(e, t) {
      let i = 0,
        r = new oe("twisty-alg-conjugate", e);
      r.addString("[");
      let s = r.addElem(
        this.traverseAlg(e.A, {
          earliestMoveIndex: t.earliestMoveIndex + i,
          twistyAlgViewer: t.twistyAlgViewer,
          direction: t.direction,
        })
      );
      return (
        (i += s),
        r.addString(": "),
        (i += r.addElem(
          this.traverseAlg(e.B, {
            earliestMoveIndex: t.earliestMoveIndex + i,
            twistyAlgViewer: t.twistyAlgViewer,
            direction: t.direction,
          })
        )),
        r.addString("]"),
        r.flushQueue(),
        { moveCount: i + s, element: r }
      );
    }
    traversePause(e, t) {
      return e.experimentalNISSGrouping
        ? this.traverseAlg(e.experimentalNISSGrouping.alg, t)
        : {
            moveCount: 1,
            element: new ae("twisty-alg-pause", ".", t, e, !0, !0),
          };
    }
    traverseNewline(e, t) {
      let i = new oe("twisty-alg-newline", e);
      return (
        i.append(document.createElement("br")), { moveCount: 0, element: i }
      );
    }
    traverseLineComment(e, t) {
      return {
        moveCount: 0,
        element: new ae("twisty-alg-line-comment", `//${e.text}`, t, e, !1, !1),
      };
    }
  },
  Vs = S(Os),
  Us = class {
    constructor() {
      (this.moveCharIndexMap = new Map()), (this.currentElem = null);
    }
    addMove(e, t) {
      this.moveCharIndexMap.set(e, t);
    }
    set(e) {
      let t = e ? this.moveCharIndexMap.get(e.startCharIndex) ?? null : null;
      this.currentElem !== t &&
        (this.currentElem?.classList.remove("twisty-alg-current-move"),
        this.currentElem?.setCurrentMove(!1),
        t?.classList.add("twisty-alg-current-move"),
        t?.setCurrentMove(!0),
        (this.currentElem = t));
    }
  },
  je,
  N,
  tt,
  Ui,
  fi,
  Vi =
    ((fi = class extends ct {
      constructor(t) {
        super();
        c(this, tt);
        c(this, je, void 0);
        c(this, N, void 0);
        (this.highlighter = new Us()),
          u(this, N, null),
          (this.lastClickTimestamp = null),
          t?.twistyPlayer && (this.twistyPlayer = t?.twistyPlayer);
      }
      connectedCallback() {}
      setAlg(t) {
        u(
          this,
          je,
          Vs(t, { earliestMoveIndex: 0, twistyAlgViewer: this, direction: 1 })
            .element
        ),
          (this.textContent = ""),
          this.appendChild(a(this, je));
      }
      get twistyPlayer() {
        return a(this, N);
      }
      set twistyPlayer(t) {
        j(this, tt, Ui).call(this, t);
      }
      async jumpToIndex(t, i) {
        let r = a(this, N);
        if (r) {
          r.pause();
          let s = (async () => {
            let n = await r.experimentalModel.indexer.get(),
              o = i ? Ps : 0;
            return n.indexToMoveStartTimestamp(t) + n.moveDuration(t) - o;
          })();
          r.experimentalModel.timestampRequest.set(await s),
            this.lastClickTimestamp === (await s)
              ? (r.play(), (this.lastClickTimestamp = null))
              : (this.lastClickTimestamp = await s);
        }
      }
      async attributeChangedCallback(t, i, r) {
        if (t === "for") {
          let s = document.getElementById(r);
          if (!s) {
            console.warn("for= elem does not exist");
            return;
          }
          if (
            (await customElements.whenDefined("twisty-player"),
            !(s instanceof ye))
          ) {
            console.warn("for= elem is not a twisty-player");
            return;
          }
          this.twistyPlayer = s;
        }
      }
      static get observedAttributes() {
        return ["for"];
      }
    }),
    (je = new WeakMap()),
    (N = new WeakMap()),
    (tt = new WeakSet()),
    (Ui = async function (t) {
      if (a(this, N)) {
        console.warn("twisty-player reassignment is not supported");
        return;
      }
      if (t === null) throw new Error("clearing twistyPlayer is not supported");
      u(this, N, t),
        a(this, N).experimentalModel.alg.addFreshListener((s) => {
          this.setAlg(s.alg);
        });
      let i = (await a(this, N).experimentalModel.alg.get()).alg,
        r = "startCharIndex" in i ? i : A.fromString(i.toString());
      this.setAlg(r),
        t.experimentalModel.currentMoveInfo.addFreshListener((s) => {
          let n = s.currentMoves[0];
          if (
            (n ?? (n = s.movesStarting[0]), n ?? (n = s.movesFinishing[0]), !n)
          )
            this.highlighter.set(null);
          else {
            let o = n.move;
            this.highlighter.set(o);
          }
        }),
        t.experimentalModel.detailedTimelineInfo.addFreshListener((s) => {
          s.timestamp !== this.lastClickTimestamp &&
            (this.lastClickTimestamp = null);
        });
    }),
    fi);
T.define("twisty-alg-viewer", Vi);
var Fs = class extends xe {
    traverseAlg(e, t) {
      let i = [],
        r = 0;
      for (let s of e.childAlgNodes()) {
        let n = this.traverseAlgNode(s, { numMovesSofar: t.numMovesSofar + r });
        i.push(n.tokens), (r += n.numLeavesInside);
      }
      return { tokens: Array.prototype.concat(...i), numLeavesInside: r };
    }
    traverseGrouping(e, t) {
      let i = this.traverseAlg(e.alg, t);
      return {
        tokens: i.tokens,
        numLeavesInside: i.numLeavesInside * e.amount,
      };
    }
    traverseMove(e, t) {
      return {
        tokens: [{ leaf: e, idx: t.numMovesSofar }],
        numLeavesInside: 1,
      };
    }
    traverseCommutator(e, t) {
      let i = this.traverseAlg(e.A, t),
        r = this.traverseAlg(e.B, {
          numMovesSofar: t.numMovesSofar + i.numLeavesInside,
        });
      return {
        tokens: i.tokens.concat(r.tokens),
        numLeavesInside: i.numLeavesInside * 2 + r.numLeavesInside,
      };
    }
    traverseConjugate(e, t) {
      let i = this.traverseAlg(e.A, t),
        r = this.traverseAlg(e.B, {
          numMovesSofar: t.numMovesSofar + i.numLeavesInside,
        });
      return {
        tokens: i.tokens.concat(r.tokens),
        numLeavesInside: i.numLeavesInside * 2 + r.numLeavesInside * 2,
      };
    }
    traversePause(e, t) {
      return {
        tokens: [{ leaf: e, idx: t.numMovesSofar }],
        numLeavesInside: 1,
      };
    }
    traverseNewline(e, t) {
      return { tokens: [], numLeavesInside: 0 };
    }
    traverseLineComment(e, t) {
      return { tokens: [], numLeavesInside: 0 };
    }
  },
  Bs = S(Fs),
  Ws = class extends w {
    getDefaultValue() {
      return "";
    }
  },
  qs = class extends f {
    derive(e) {
      return Ei(e.value);
    }
  },
  Hs = class extends q {
    getDefaultValue() {
      return { selectionStart: 0, selectionEnd: 0, endChangedMostRecently: !1 };
    }
    async derive(e, t) {
      let { selectionStart: i, selectionEnd: r } = e,
        s = await t,
        n =
          e.selectionStart === s.selectionStart &&
          e.selectionEnd !== (await t).selectionEnd;
      return { selectionStart: i, selectionEnd: r, endChangedMostRecently: n };
    }
  },
  Qs = class extends f {
    derive(e) {
      return e.selectionInfo.endChangedMostRecently
        ? e.selectionInfo.selectionEnd
        : e.selectionInfo.selectionStart;
    }
  },
  Ys = class extends f {
    derive(e) {
      return Bs(e.algWithIssues.alg, { numMovesSofar: 0 }).tokens;
    }
  },
  _s = class extends f {
    derive(e) {
      function t(r) {
        if (r === null) return null;
        let s;
        return (
          e.targetChar < r.leaf.startCharIndex
            ? (s = "before")
            : e.targetChar === r.leaf.startCharIndex
            ? (s = "start")
            : e.targetChar < r.leaf.endCharIndex
            ? (s = "inside")
            : e.targetChar === r.leaf.endCharIndex
            ? (s = "end")
            : (s = "after"),
          { leafInfo: r, where: s }
        );
      }
      let i = null;
      for (let r of e.leafTokens) {
        if (e.targetChar < r.leaf.startCharIndex && i !== null) return t(i);
        if (e.targetChar <= r.leaf.endCharIndex) return t(r);
        i = r;
      }
      return t(i);
    }
  },
  Gs = class {
    constructor() {
      (this.valueProp = new Ws()),
        (this.selectionProp = new Hs()),
        (this.targetCharProp = new Qs({ selectionInfo: this.selectionProp })),
        (this.algEditorAlgWithIssues = new qs({ value: this.valueProp })),
        (this.leafTokensProp = new Ys({
          algWithIssues: this.algEditorAlgWithIssues,
        })),
        (this.leafToHighlight = new _s({
          leafTokens: this.leafTokensProp,
          targetChar: this.targetCharProp,
        }));
    }
  },
  Zs = new C(`
:host {
  width: 384px;
  display: grid;
}

.wrapper {
  /*overflow: hidden;
  resize: horizontal;*/

  background: var(--background, none);
  display: grid;
}

textarea, .carbon-copy {
  grid-area: 1 / 1 / 2 / 2;

  width: 100%;
  font-family: sans-serif;
  line-height: 1.2em;

  font-size: var(--font-size, inherit);
  font-family: var(--font-family, sans-serif);

  box-sizing: border-box;

  padding: var(--padding, 0.5em);
  /* Prevent horizontal growth. */
  overflow-x: hidden;
}

textarea {
  resize: none;
  background: none;
  z-index: 2;
  overflow: hidden;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.25));
}

.carbon-copy {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
  user-select: none;
  pointer-events: none;

  z-index: 1;
}

.carbon-copy .highlight {
  background: var(--highlight-color, rgba(255, 128, 0, 0.5));
  padding: 0.1em 0.2em;
  margin: -0.1em -0.2em;
  border-radius: 0.2em;
}

.wrapper.issue-warning textarea,
.wrapper.valid-for-puzzle-warning textarea {
  outline: none;
  border: 1px solid rgba(200, 200, 0, 0.5);
  background: rgba(255, 255, 0, 0.1);
}

.wrapper.issue-error textarea,
.wrapper.valid-for-puzzle-error textarea {
  outline: none;
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
`),
  Qe = "for-twisty-player",
  ti = "placeholder",
  ii = "twisty-player-prop",
  y,
  F,
  Y,
  P,
  _,
  Oe,
  D,
  B,
  pe,
  _e,
  ge,
  Ve,
  xt,
  fe,
  wi,
  Xs =
    ((wi = class extends k {
      constructor(t) {
        super();
        c(this, pe);
        c(this, Ve);
        c(this, y, void 0);
        c(this, F, void 0);
        c(this, Y, void 0);
        c(this, P, void 0);
        c(this, _, void 0);
        c(this, Oe, void 0);
        c(this, D, void 0);
        c(this, B, void 0);
        c(this, ge, void 0);
        c(this, fe, void 0);
        (this.model = new Gs()),
          u(this, y, document.createElement("textarea")),
          u(this, F, document.createElement("div")),
          u(this, Y, document.createElement("span")),
          u(this, P, document.createElement("span")),
          u(this, _, document.createElement("span")),
          u(
            this,
            Oe,
            new it(this, "valid-for-puzzle-", ["none", "warning", "error"])
          ),
          u(this, D, null),
          (this.debugNeverRequestTimestamp = !1),
          u(this, ge, !1),
          u(this, fe, null),
          a(this, F).classList.add("carbon-copy"),
          this.addElement(a(this, F)),
          (a(this, y).rows = 1),
          this.addElement(a(this, y)),
          a(this, Y).classList.add("prefix"),
          a(this, F).appendChild(a(this, Y)),
          a(this, P).classList.add("highlight"),
          a(this, F).appendChild(a(this, P)),
          a(this, _).classList.add("suffix"),
          a(this, F).appendChild(a(this, _)),
          (a(this, y).placeholder = "Alg"),
          a(this, y).setAttribute("spellcheck", "false"),
          this.addCSS(Zs),
          a(this, y).addEventListener("input", () => {
            u(this, ge, !0), this.onInput();
          }),
          a(this, y).addEventListener("blur", () => this.onBlur()),
          document.addEventListener("selectionchange", () =>
            this.onSelectionChange()
          ),
          t?.twistyPlayer && (this.twistyPlayer = t.twistyPlayer),
          u(this, B, t?.twistyPlayerProp ?? "alg"),
          t?.twistyPlayerProp === "alg" &&
            this.model.leafToHighlight.addFreshListener((i) => {
              i && this.highlightLeaf(i.leafInfo.leaf);
            });
      }
      set algString(t) {
        (a(this, y).value = t), this.onInput();
      }
      get algString() {
        return a(this, y).value;
      }
      set placeholder(t) {
        a(this, y).placeholder = t;
      }
      onInput() {
        (a(this, P).hidden = !0), this.highlightLeaf(null);
        let t = a(this, y).value.trimEnd();
        this.model.valueProp.set(t), a(this, pe, _e)?.set(t);
      }
      async onSelectionChange() {
        if (
          document.activeElement !== this ||
          this.shadow.activeElement !== a(this, y) ||
          a(this, B) !== "alg"
        )
          return;
        let { selectionStart: t, selectionEnd: i } = a(this, y);
        this.model.selectionProp.set({ selectionStart: t, selectionEnd: i });
      }
      async onBlur() {}
      setAlgIssueClassForPuzzle(t) {
        a(this, Oe).setValue(t);
      }
      highlightLeaf(t) {
        if (a(this, B) === "alg") {
          if (t === null) {
            (a(this, Y).textContent = ""),
              (a(this, P).textContent = ""),
              (a(this, _).textContent = j(this, Ve, xt).call(
                this,
                a(this, y).value
              ));
            return;
          }
          t !== a(this, fe) &&
            (u(this, fe, t),
            (a(this, Y).textContent = a(this, y).value.slice(
              0,
              t.startCharIndex
            )),
            (a(this, P).textContent = a(this, y).value.slice(
              t.startCharIndex,
              t.endCharIndex
            )),
            (a(this, _).textContent = j(this, Ve, xt).call(
              this,
              a(this, y).value.slice(t.endCharIndex)
            )),
            (a(this, P).hidden = !1));
        }
      }
      get twistyPlayer() {
        return a(this, D);
      }
      set twistyPlayer(t) {
        if (a(this, D)) {
          console.warn("twisty-player reassignment/clearing is not supported");
          return;
        }
        u(this, D, t),
          t &&
            ((async () =>
              (this.algString = a(this, pe, _e)
                ? (await a(this, pe, _e).get()).alg.toString()
                : ""))(),
            a(this, B) === "alg" &&
              (a(this, D)?.experimentalModel.puzzleAlg.addFreshListener((i) => {
                if (i.issues.errors.length === 0) {
                  this.setAlgIssueClassForPuzzle(
                    i.issues.warnings.length === 0 ? "none" : "warning"
                  );
                  let r = i.alg,
                    s = A.fromString(this.algString);
                  r.isIdentical(s) ||
                    ((this.algString = r.toString()), this.onInput());
                } else this.setAlgIssueClassForPuzzle("error");
              }),
              this.model.leafToHighlight.addFreshListener(async (i) => {
                if (i === null) return;
                let [r, s] = await Promise.all([
                  await t.experimentalModel.indexer.get(),
                  await t.experimentalModel.timestampRequest.get(),
                ]);
                if (s === "opposite-anchor" && !a(this, ge)) return;
                let n = r.indexToMoveStartTimestamp(i.leafInfo.idx),
                  o = r.moveDuration(i.leafInfo.idx),
                  l;
                switch (i.where) {
                  case "before": {
                    l = n;
                    break;
                  }
                  case "start":
                  case "inside": {
                    l = n + o / 4;
                    break;
                  }
                  case "end":
                  case "after": {
                    l = n + o;
                    break;
                  }
                  default:
                    throw (
                      (console.log("invalid where"),
                      new Error("Invalid where!"))
                    );
                }
                this.debugNeverRequestTimestamp ||
                  t.experimentalModel.timestampRequest.set(l);
              }),
              t.experimentalModel.currentLeavesSimplified.addFreshListener(
                async (i) => {
                  let s = (await t.experimentalModel.indexer.get()).getAnimLeaf(
                    i.stateIndex
                  );
                  this.highlightLeaf(s);
                }
              )));
      }
      attributeChangedCallback(t, i, r) {
        switch (t) {
          case Qe: {
            let s = document.getElementById(r);
            if (!s) {
              console.warn(`${Qe}= elem does not exist`);
              return;
            }
            if (!(s instanceof ye)) {
              console.warn(`${Qe}=is not a twisty-player`);
              return;
            }
            this.twistyPlayer = s;
            return;
          }
          case ti: {
            this.placeholder = r;
            return;
          }
          case ii: {
            if (a(this, D))
              throw (
                (console.log("cannot set prop"),
                new Error("cannot set prop after twisty player"))
              );
            u(this, B, r);
            return;
          }
        }
      }
      static get observedAttributes() {
        return [Qe, ti, ii];
      }
    }),
    (y = new WeakMap()),
    (F = new WeakMap()),
    (Y = new WeakMap()),
    (P = new WeakMap()),
    (_ = new WeakMap()),
    (Oe = new WeakMap()),
    (D = new WeakMap()),
    (B = new WeakMap()),
    (pe = new WeakSet()),
    (_e = function () {
      return a(this, D) === null
        ? null
        : a(this, D).experimentalModel[a(this, B)];
    }),
    (ge = new WeakMap()),
    (Ve = new WeakSet()),
    (xt = function (t) {
      return t.endsWith(`
`)
        ? `${t} `
        : t;
    }),
    (fe = new WeakMap()),
    wi);
T.define("twisty-alg-editor", Xs);
var $s = new C(`
.wrapper {
  background: rgb(255, 245, 235);
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid rgba(0, 0, 0, 0.25);
}

.setup-alg, twisty-alg-viewer {
  padding: 0.5em 1em;
}

.heading {
  background: rgba(255, 230, 210, 1);
  font-weight: bold;
  padding: 0.25em 0.5em;    display: grid;
  grid-template-columns: 1fr auto;
}

.heading.title {
  background: rgb(255, 245, 235);
  font-size: 150%;
  white-space: pre;
}

.heading a {
  text-decoration: none;
  color: inherit;
}

twisty-player {
  width: 100%;
  resize: vertical;
  overflow-y: hidden;
}

twisty-player + .heading {
  padding-top: 0.5em;
}
`);
function Js(e = "", t = location.href) {
  let i = {
      alg: "alg",
      "setup-alg": "experimental-setup-alg",
      "setup-anchor": "experimental-setup-anchor",
      puzzle: "puzzle",
      stickering: "experimental-stickering",
      "puzzle-description": "experimental-puzzle-description",
      title: "experimental-title",
      "video-url": "experimental-video-url",
      competition: "experimental-competition-id",
    },
    r = new URL(t).searchParams,
    s = {};
  for (let [n, o] of Object.entries(i)) {
    let l = r.get(e + n);
    if (l !== null) {
      let m = Ze[o];
      s[m] = l;
    }
  }
  return s;
}
var we,
  vi,
  Ks =
    ((vi = class extends k {
      constructor() {
        super({ mode: "open" });
        c(this, we, void 0);
        (this.twistyPlayer = null), (this.a = null);
      }
      fallback() {
        if (((this.contentWrapper.textContent = ""), this.a)) {
          let t = this.contentWrapper.appendChild(
            document.createElement("span")
          );
          (t.textContent = "\u2757\uFE0F"),
            (t.title = "Could not show a player for link"),
            this.addElement(this.a);
        }
        a(this, we) && a(this, we).remove();
      }
      async connectedCallback() {
        if (
          (u(this, we, this.addCSS($s)),
          (this.a = this.querySelector("a")),
          !this.a)
        )
          return;
        let t = Js("", this.a.href),
          i = this.a?.href,
          { hostname: r, pathname: s } = new URL(i);
        if (r !== "alpha.twizzle.net") {
          this.fallback();
          return;
        }
        if (["/edit/", "/explore/"].includes(s)) {
          let n = s === "/explore/";
          if (t.puzzle && !(t.puzzle in qe)) {
            let l = (
              await import("./chunks/puzzle-geometry-LRWVA7LC.js")
            ).getPuzzleDescriptionString(t.puzzle);
            delete t.puzzle, (t.experimentalPuzzleDescription = l);
          }
          if (
            ((this.twistyPlayer = this.addElement(
              new ye({
                ...t,
                viewerLink: n ? "experimental-twizzle-explorer" : "auto",
              })
            )),
            t.experimentalTitle &&
              this.addHeading(t.experimentalTitle).classList.add("title"),
            t.experimentalSetupAlg)
          ) {
            this.addHeading(
              "Setup",
              async () =>
                (
                  await this.twistyPlayer?.experimentalModel.setupAlg.get()
                )?.alg.toString() ?? null
            );
            let l = this.addElement(document.createElement("div"));
            l.classList.add("setup-alg"),
              (l.textContent = new A(t.experimentalSetupAlg).toString());
          }
          this.addHeading(
            "Moves",
            async () =>
              (
                await this.twistyPlayer?.experimentalModel.alg.get()
              )?.alg.toString() ?? null
          ),
            this.addElement(
              new Vi({ twistyPlayer: this.twistyPlayer })
            ).part.add("twisty-alg-viewer");
        } else this.fallback();
      }
      addHeading(t, i) {
        let r = this.addElement(document.createElement("div"));
        if ((r.classList.add("heading"), (r.textContent = t), i)) {
          r.textContent += " ";
          let s = r.appendChild(document.createElement("a"));
          (s.textContent = "\u{1F4CB}"),
            (s.href = "#"),
            (s.title = "Copy to clipboard");
          async function n(o) {
            (s.textContent = o),
              await new Promise((l) => setTimeout(l, 2e3)),
              s.textContent === o && (s.textContent = "\u{1F4CB}");
          }
          s.addEventListener("click", async (o) => {
            o.preventDefault(), (s.textContent = "\u{1F4CB}\u2026");
            let l = await i();
            if (l)
              try {
                await navigator.clipboard.writeText(l), n("\u{1F4CB}\u2705");
              } catch (m) {
                throw (n("\u{1F4CB}\u274C"), m);
              }
            else n("\u{1F4CB}\u274C");
          });
        }
        return r;
      }
    }),
    (we = new WeakMap()),
    vi);
T.define("twizzle-link", Ks);
var Fi = (e, t, i) => {
    if (!t.has(e)) throw TypeError("Cannot " + i);
  },
  M = (e, t, i) => (
    Fi(e, t, "read from private field"), i ? i.call(e) : t.get(e)
  ),
  rt = (e, t, i) => {
    if (t.has(e))
      throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(e) : t.set(e, i);
  },
  en = (e, t, i, r) => (
    Fi(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i
  ),
  tn = `
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-content: center;
  overflow: hidden;
}

.wrapper > * {
  width: inherit;
  height: inherit;
  overflow: hidden;
}

twisty-player {
  width: 100%;
  height: 100%;
}
`,
  rn = "333",
  sn = rn,
  Ue,
  Me,
  R,
  G,
  nn = class extends HTMLElement {
    constructor() {
      super(),
        rt(this, Ue, void 0),
        rt(this, Me, document.createElement("div")),
        rt(this, R, {
          eventID: null,
          scramble: new A(),
          visualization: null,
          checkered: !1,
        }),
        rt(
          this,
          G,
          new ye({
            controlPanel: "none",
            hintFacelets: "none",
            visualization: "2D",
            background: "none",
          })
        ),
        en(this, Ue, this.attachShadow({ mode: "closed" })),
        M(this, Me).classList.add("wrapper"),
        M(this, Ue).appendChild(M(this, Me));
      let e = document.createElement("style");
      (e.textContent = tn), M(this, Ue).appendChild(e);
    }
    get player() {
      return M(this, G);
    }
    connectedCallback() {
      M(this, Me).appendChild(M(this, G));
    }
    set event(e) {
      var t;
      let i = at(e ?? sn);
      (M(this, G).puzzle = (t = i?.puzzleID) != null ? t : "3x3x3"),
        (M(this, R).eventID = e);
    }
    get event() {
      return M(this, R).eventID;
    }
    set scramble(e) {
      let t = new A(e ?? "");
      (M(this, G).alg = t),
        (M(this, R).scramble = t),
        M(this, Me).setAttribute("title", t.toString());
    }
    get scramble() {
      return M(this, R).scramble;
    }
    set visualization(e) {
      (M(this, G).visualization = e ?? "2D"), (M(this, R).visualization = e);
    }
    get visualization() {
      return M(this, R).visualization;
    }
    set checkered(e) {
      let t = !!e;
      (M(this, G).background = t ? "checkered" : "none"),
        (M(this, R).checkered = t);
    }
    get checkered() {
      return M(this, R).checkered;
    }
    attributeChangedCallback(e, t, i) {
      switch (e) {
        case "event": {
          this.event = i;
          break;
        }
        case "scramble": {
          this.scramble = i;
          break;
        }
        case "visualization": {
          this.visualization = i;
          break;
        }
        case "checkered": {
          this.checkered = i !== null;
          break;
        }
      }
    }
    static get observedAttributes() {
      return ["event", "scramble", "visualization", "checkered"];
    }
  };
Ue = new WeakMap();
Me = new WeakMap();
R = new WeakMap();
G = new WeakMap();
customElements.define("scramble-display", nn);
export { nn as ScrambleDisplay };
//# sourceMappingURL=scramble-display.js.map
