'use strict';

class InputsPanel extends HTMLElement {
  createdCallback() {
    this.run = document.createElement('button');
    this.run.classList.add('btn', 'icon-bug');
    this.run.textContent = "RUN"
    this.appendChild(this.run);
    var t = this;
    this.run.addEventListener('click', function (e) {
      console.log("RU");
      t.runfun();

    });

    this.heading = document.createElement('h1');
    this.heading.classList.add('heading');
    this.heading.textContent = "Inputs";
    this.appendChild(this.heading);

    this.inputs = document.createElement('textarea');
    this.inputs.classList.add("minputs");
    this.appendChild(this.inputs);

    var out_lab = document.createElement('h1');
    out_lab.classList.add('heading');
    out_lab.textContent = "Outputs";
    this.appendChild(out_lab);

    this.outputs = document.createElement('textarea');
    this.outputs.classList.add("minputs");
    this.appendChild(this.outputs);

  }

  attachedCallback() {}

  detachedCallback() {}
}

module.exports = document.registerElement(
  'inputs-view', {
    prototype: InputsPanel.prototype,
    extends: 'div'
  }
);
