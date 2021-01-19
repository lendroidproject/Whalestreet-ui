export default `
/**
 * 98.css
 * Copyright (c) 2020 Jordan Scales <thatjdanisso.cool>
 * https://github.com/jdan/98.css/blob/main/LICENSE
 */

a, button, .cursor { cursor: pointer; user-select: none; }
button, input { font-weight: bold; }
.center { text-align: center; }
.flex { display: flex; }
.flex-all { display: flex; flex-direction: column; justify-content: center; align-items: center; }
.flex-wrap { display: flex; flex-wrap: wrap; }
.flex-center { display: flex; align-items: center; }
.flex-column { display: flex; flex-direction: column; }
.flex-start { display: flex; align-items: flex-start; }
.flex-end { display: flex; align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.relative { position: relative }
.fill { position: absolute; left: 0; right: 0; top: 0; bottom: 0; }
button { border: none; }
h1, h2, h3, h4, h5, p { margin-top: 0; margin-bottom: 0px; }
.uppercase { text-transform: uppercase; }
.light { font-weight: normal; }
h1 {
  font-size: 24px;
  line-height: 29px;
  color: var(--color-black);
}
h2 {
  font-size: 20px;
  line-height: 24px;
  color: var(--color-black);
}
h3 {
  font-size: 16px;
  line-height: 20px;
  color: var(--color-black);
}
h4 {
  font-size: 14px;
  line-height: 17px;
  color: var(--color-black);
}
p {
  font-size: 14px;
  line-height: 17px;
  color: var(--color-grey);
}
a {
  color: var(--color-blue);
}
.col-black {
  color: var(--color-black);
}
.col-white {
  color: var(--color-white);
}
.col-blue {
  color: var(--color-blue);
}
.col-dark-blue {
  color: var(--color-dark-blue);
}
.col-red {
  color: var(--color-red);
}
.col-green {
  color: var(--color-green);
}
.col-yellow {
  color: var(--color-yellow);
}
*::-webkit-scrollbar { width: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { border-radius: 5px; background-color: var(--color-black); }
*::-webkit-scrollbar-thumb:hover { background: var(--color-grey); }

button,
label,
input,
textarea,
select,
option,
ul.tree-view,
.window,
.window-menu,
.window-content,
.title-bar {
  -webkit-font-smoothing: none;
}

u {
  text-decoration: none;
  border-bottom: 0.5px solid #222222;
}

button {
  box-sizing: border-box;
  border: none;
  background: var(--surface);
  box-shadow: var(--border-raised-outer), var(--border-raised-inner);
  border-radius: 0;

  min-width: 75px;
  min-height: 23px;
  padding: 8px 20px 6px;
  font-size: 16px;
}

.vertical-bar {
  width: 4px;
  height: 20px;
  background: #c0c0c0;
  box-shadow: var(--border-raised-outer), var(--border-raised-inner);
}

button:not(:disabled):active {
  box-shadow: var(--border-sunken-outer), var(--border-sunken-inner);
  /* padding: 2px 11px 0 13px; */
}

button:focus {
  outline: 1px dotted #000000;
  outline-offset: -4px;
}

button::-moz-focus-inner {
  border: 0;
}


button.btn-primary {
  background-color: #D418CB;
  color: #fff;
  border-top: 1px solid #222;
  border-left: 1px solid #222;
}


button.btn-secondary {
  background-color: #B4B4B4;
  color: #656565;
  text-shadow: 0px 1px 0 #fff;
  border-top: 1px solid #222;
  border-left: 1px solid #222;
}

:disabled,
:disabled + label {
  color: var(--button-shadow);
  text-shadow: 1px 1px 0 var(--button-highlight);
}

.window {
  box-shadow: var(--border-window-outer), var(--border-window-inner);
  background: var(--surface);
  padding: 3px;
}

.title-bar {
  background: #06157F;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-bar.inactive {
  background: linear-gradient(
    90deg,
    var(--dialog-gray),
    var(--dialog-gray-light)
  );
}

.title-bar-text {
  font-weight: bold;
  color: white;
  letter-spacing: 0;
  margin-right: 24px;
  font-size: 20px;
  line-height: 24px;
}

.title-bar-controls {
  display: flex;
}

.title-bar-controls button {
  padding: 0;
  display: block;
  min-width: 16px;
  min-height: 14px;
}

.title-bar-controls button:active {
  padding: 0;
}

.title-bar-controls button:focus {
  outline: none;
}

.title-bar-controls button[aria-label="Minimize"] {
  background-image: url("/icon/minimize.svg");
  background-repeat: no-repeat;
  background-position: bottom 3px left 4px;
}

.title-bar-controls button[aria-label="Maximize"] {
  background-image: url("/icon/maximize.svg");
  background-repeat: no-repeat;
  background-position: top 2px left 3px;
}

.title-bar-controls button[aria-label="Restore"] {
  background-image: url("/icon/restore.svg");
  background-repeat: no-repeat;
  background-position: top 2px left 3px;
}

.title-bar-controls button[aria-label="Help"] {
  background-image: url("/icon/help.svg");
  background-repeat: no-repeat;
  background-position: top 2px left 5px;
}

.title-bar-controls button[aria-label="Close"] {
  margin-left: 2px;
  background-image: url("/icon/close.svg");
  background-repeat: no-repeat;
  background-position: top 3px left 4px;
}

.window-menu {
  padding: 12px 12px;
}

.window-content {
  background: #D8D8D8;
  box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
  border-bottom: 1px solid grey;
  padding: 24px 32px;
  margin: 0;
  margin-right: 2px;
}

.window-footer {
  margin-top: 2px;
}

.window-footer-panel {
  box-sizing: border-box;
  height: 22px;
  background-color: #B4B4B4;
  box-shadow: inset -1px -1px #fff, inset 1px 1px #dfdfdf, inset -1px -1px #dfdfdf, inset 2px 2px grey;
  margin-right: 2px;
}

fieldset {
  border: none;
  box-shadow: inset -1px -1px var(--button-highlight), inset -2px 1px var(--button-shadow),
    inset 1px -2px var(--button-shadow), inset 2px 2px var(--button-highlight);
  padding: calc(2 * var(--border-width) + var(--element-spacing));
  padding-block-start: var(--element-spacing);
  margin: 0;
}

legend {
  background: var(--surface);
}

.field-row {
  display: flex;
  align-items: center;
}

[class^="field-row"] + [class^="field-row"] {
  margin-top: var(--grouped-element-spacing);
}

.field-row > * + * {
  margin-left: var(--grouped-element-spacing);
}

.field-row-stacked {
  display: flex;
  flex-direction: column;
}

.field-row-stacked * + * {
  margin-top: var(--grouped-element-spacing);
}

label {
  display: inline-flex;
  align-items: center;
}

input[type="radio"],
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  margin: 0;
  background: 0;
  position: fixed;
  opacity: 0;
  border: none;
}

input[type="radio"] + label,
input[type="checkbox"] + label {
  line-height: 13px;
}

input[type="radio"] + label {
  position: relative;
  margin-left: var(--radio-total-width);
}

input[type="radio"] + label::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(-1 * (var(--radio-total-width-precalc)));
  display: inline-block;
  width: var(--radio-width);
  height: var(--radio-width);
  margin-right: var(--radio-label-spacing);
  background: url("/icon/radio-border.svg");
}

input[type="radio"]:active + label::before {
  background: url("/icon/radio-border-disabled.svg");
}

input[type="radio"]:checked + label::after {
  content: "";
  display: block;
  width: var(--radio-dot-width);
  height: var(--radio-dot-width);
  top: var(--radio-dot-top);
  left: var(--radio-dot-left);
  position: absolute;
  background: url("/icon/radio-dot.svg");
}

input[type="radio"]:focus + label {
  outline: 1px dotted #000000;
}

input[type="radio"][disabled] + label::before {
  background: url("/icon/radio-border-disabled.svg");
}

input[type="radio"][disabled]:checked + label::after {
  background: url("/icon/radio-dot-disabled.svg");
}

input[type="checkbox"] + label {
  position: relative;
  margin-left: var(--checkbox-total-width);
}

input[type="checkbox"] + label::before {
  content: "";
  position: absolute;
  left: calc(-1 * (var(--checkbox-total-width-precalc)));
  display: inline-block;
  width: var(--checkbox-width);
  height: var(--checkbox-width);
  margin-right: var(--radio-label-spacing);
  border: 1px solid black;
  box-shadow: inset 0 0px 1px 1px rgba(0,0,0,0.5);
  margin-right: var(--radio-label-spacing);
}

input[type="checkbox"].checkbox-secondary + label::before {
  border: 1px solid white;
  box-shadow: inset 0 0px 1px 1px rgba(255,255,255,0.5);
}

input[type="checkbox"]:active + label::before {
  background: var(--surface);
}

input[type="checkbox"]:checked + label::after {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  position: absolute;
  top: -6px;
  left: calc( -1 * (var(--checkbox-total-width-precalc)) + var(--checkmark-left) );
  background-image: url('/assets/checkmark.svg');
  background-repeat: no-repeat;
  background-size: contain;
}

input[type="checkbox"].checkbox-secondary:checked + label::after {
  background-image: url('/assets/checkmark-white.svg');
}

input[type="checkbox"][disabled] + label::before {
  background: var(--surface);
}

input[type="checkbox"][disabled]:checked + label::after {
  background: url("/assets/checkmark-disabled.svg");
}

input[type="text"],
input[type="date"],
input[type="password"],
input[type="email"],
select,
textarea {
  padding: 9px 15px;
  border: none;
  box-shadow: var(--border-field);
  background-color: var(--button-highlight);
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  font-weight: normal;
  color: #000;
  letter-spacing: 0.75px;
  line-height: 15px;
  font-size: 12px;
}

::placeholder {
  color: #000;
  opacity: 1;
}

:-ms-input-placeholder {
  color: #000;
}

::-ms-input-placeholder {
  color: #000;
}

input[type="date"]::-webkit-inner-spin-button {
  opacity: 0
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background: url('/assets/calendar.svg') center/100% no-repeat;
  color: rgba(0, 0, 0, 0);
  opacity: 1
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  background: url('/assets/calendar.svg') center/100% no-repeat;
  opacity: 1
}

input[type="date"]::-webkit-calendar-picker-indicator:active,
input[type="date"]::-webkit-calendar-picker-indicator:focus {
  outline: none;
}

input[type="text"],
input[type="date"],
input[type="password"],
input[type="email"],
select {
  height: 32px;
}

input[type="text"],
input[type="date"],
input[type="password"],
input[type="email"] {
  /* For some reason descenders are getting cut off without this */
  line-height: 2;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  padding-right: 40px;
  background-position: top 1px right 2px;
  background-repeat: no-repeat;
  background-image:url("/assets/dropdown.svg");
  background-size: 30px 30px;
  border-radius: 0;
}

select:focus,
input[type="text"]:focus,
input[type="date"]:focus,
input[type="password"]:focus,
input[type="email"]:focus,
textarea:focus {
  outline: none;
}

input[type="date"] {
  padding-right: 5px;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 21px;
  width: 11px;
  transform: translateY(-8px);
}

input[type="range"].has-box-indicator::-webkit-slider-thumb {
  background: url("/icon/indicator-rectangle-horizontal.svg");
  transform: translateY(-10px);
}

input[type="range"]::-moz-range-thumb {
  height: 21px;
  width: 11px;
  border: 0;
  border-radius: 0;
  transform: translateY(2px);
}

input[type="range"].has-box-indicator::-moz-range-thumb {
  transform: translateY(0px);
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  box-sizing: border-box;
  background: black;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  box-shadow: 1px 0 0 white, 1px 1px 0 white, 0 1px 0 white, -1px 0 0 darkgrey,
    -1px -1px 0 darkgrey, 0 -1px 0 darkgrey, -1px 1px 0 white, 1px -1px darkgrey;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 2px;
  box-sizing: border-box;
  background: black;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  box-shadow: 1px 0 0 white, 1px 1px 0 white, 0 1px 0 white, -1px 0 0 darkgrey,
    -1px -1px 0 darkgrey, 0 -1px 0 darkgrey, -1px 1px 0 white, 1px -1px darkgrey;
}

.is-vertical {
  display: inline-block;
  width: 4px;
  height: 150px;
  transform: translateY(50%);
}

.is-vertical > input[type="range"] {
  width: 150px;
  height: 4px;
  margin: 0 calc(var(--grouped-element-spacing) + var(--range-spacing)) 0
    var(--range-spacing);
  transform-origin: left;
  transform: rotate(270deg) translateX(calc(-50% + var(--element-spacing)));
}

.is-vertical > input[type="range"]::-webkit-slider-runnable-track {
  border-left: 1px solid grey;
  border-right: 0;
  border-bottom: 1px solid grey;
  box-shadow: -1px 0 0 white, -1px 1px 0 white, 0 1px 0 white, 1px 0 0 darkgrey,
    1px -1px 0 darkgrey, 0 -1px 0 darkgrey, 1px 1px 0 white, -1px -1px darkgrey;
}

.is-vertical > input[type="range"]::-moz-range-track {
  border-left: 1px solid grey;
  border-right: 0;
  border-bottom: 1px solid grey;
  box-shadow: -1px 0 0 white, -1px 1px 0 white, 0 1px 0 white, 1px 0 0 darkgrey,
    1px -1px 0 darkgrey, 0 -1px 0 darkgrey, 1px 1px 0 white, -1px -1px darkgrey;
}

.is-vertical > input[type="range"]::-webkit-slider-thumb {
  transform: translateY(-8px) scaleX(-1);
}

.is-vertical > input[type="range"].has-box-indicator::-webkit-slider-thumb {
  transform: translateY(-10px) scaleX(-1);
}

.is-vertical > input[type="range"]::-moz-range-thumb {
  transform: translateY(2px) scaleX(-1);
}

.is-vertical > input[type="range"].has-box-indicator::-moz-range-thumb {
  transform: translateY(0px) scaleX(-1);
}

select:focus {
  color: var(--button-highlight);
  background-color: var(--dialog-blue);
}
select:focus option {
  color: #000;
  background-color: #fff;
}

select:active {
  background-image:url("/assets/dropdown-active.svg");
  background-size: 30px 30px;
}

a {
  color: var(--link-blue);
}

a:focus {
  outline: 1px dotted var(--link-blue);
}

ul.tree-view {
  display: block;
  background: var(--button-highlight);
  box-shadow: var(--border-field);
  padding: 6px;
  margin: 0;
}

ul.tree-view li {
  list-style-type: none;
}

ul.tree-view a {
  text-decoration: none;
  color: #000;
}

ul.tree-view a:focus {
  background-color: var(--dialog-blue);
  color: var(--button-highlight);
}

ul.tree-view ul,
ul.tree-view li {
  margin-top: 3px;
}

ul.tree-view ul {
  margin-left: 16px;
  padding-left: 16px;
  /* Goes down too far */
  border-left: 1px dotted #808080;
}

ul.tree-view ul > li {
  position: relative;
}
ul.tree-view ul > li::before {
  content: "";
  display: block;
  position: absolute;
  left: -16px;
  top: 6px;
  width: 12px;
  border-bottom: 1px dotted #808080;
}

/* Cover the bottom of the left dotted border */
ul.tree-view ul > li:last-child::after {
  content: "";
  display: block;
  position: absolute;
  left: -20px;
  top: 7px;
  bottom: 0px;
  width: 8px;
  background: var(--button-highlight);
}

ul.tree-view details {
  margin-top: 0;
}

ul.tree-view details[open] summary {
  margin-bottom: 0;
}

ul.tree-view ul details > summary:before {
  margin-left: -22px;
  position: relative;
  z-index: 1;
}

ul.tree-view details > summary:before {
  text-align: center;
  display: block;
  float: left;
  content: "+";
  border: 1px solid #808080;
  width: 8px;
  height: 9px;
  line-height: 8px;
  margin-right: 5px;
  padding-left: 1px;
  background-color: #fff;
}

ul.tree-view details[open] > summary:before {
  content: "-";
}

pre {
  display: block;
  background: var(--button-highlight);
  box-shadow: var(--border-field);
  padding: 12px 8px;
  margin: 0;
}

code,
code * {
  font-family: monospace;
}

summary:focus {
  outline: 1px dotted #000000;
}

::-webkit-scrollbar {
  width: 16px;
}
::-webkit-scrollbar:horizontal {
  height: 17px;
}

::-webkit-scrollbar-corner {
  background: var(--button-face);
}

::-webkit-scrollbar-track {
}

::-webkit-scrollbar-thumb {
  background-color: var(--button-face);
  box-shadow: var(--border-raised-outer), var(--border-raised-inner);
}

::-webkit-scrollbar-button:horizontal:start:decrement,
::-webkit-scrollbar-button:horizontal:end:increment,
::-webkit-scrollbar-button:vertical:start:decrement,
::-webkit-scrollbar-button:vertical:end:increment {
  display: block;
}

::-webkit-scrollbar-button:vertical:start {
  height: 17px;
}
::-webkit-scrollbar-button:vertical:end {
  height: 17px;
}
::-webkit-scrollbar-button:horizontal:start {
  width: 16px;
}
::-webkit-scrollbar-button:horizontal:end {
  width: 16px;
}
`
