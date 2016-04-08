'use strict';

class BlocksPanel extends HTMLElement {
  createdCallback() {
    this.heading = document.createElement('h1');
    this.heading.classList.add('heading');
    this.heading.textContent = "Blocks";
    this.appendChild(this.heading);

    this.select = document.createElement('table');
    this.select.classList.add('.blocks');
    this.appendChild(this.select);
  }

  setBlocks(main, blocks) {
    while (this.select.firstChild) {
      this.select.removeChild(this.select.firstChild);
    }

    var sel = this.select;
    var high;

    blocks.forEach(function (b) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.classList.add("btn", "icon-file-text");
      tr.appendChild(td);
      td.textContent = b.name;
      td.addEventListener("click", function (event) {
        if (high != null) {
          high.classList.remove("btn-success");
        }
        td.classList.add("btn-success");
        high = td;

        main.openBlock(b.name, b.val);
      });
      sel.appendChild(tr);
    });
  }

  attachedCallback() {}

  detachedCallback() {}
}

module.exports = document.registerElement(
  'blocks-view', {
    prototype: BlocksPanel.prototype,
    extends: 'div'
  }
);
