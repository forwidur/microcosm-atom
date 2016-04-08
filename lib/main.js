(function () {
  'use strict';

  let mainModel;

  // atoms
  const CompositeDisposable = require('atom').CompositeDisposable;

  const BlocksPanel = require('./blockspanel');
  const InputsPanel = require('./rightpan');
  const request = require('request');
  const fs = require('fs');
  const unsafe = require('loophole').allowUnsafeEval;

  class MainModel {

    activate() {
      this.disposables = new CompositeDisposable();
      this.initialize();
    }

    initialize() {
      this.blockView = new BlocksPanel();
      this.inputsPanel = new InputsPanel();

      var main = this;

      this.inputsPanel.runfun = function () {
        console.log(main.currentFile);
        var txt = fs.readFile(main.currentFile, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }

          var mod;
          unsafe(function () {
            mod = eval(data);
          });
          console.log(main.inputsPanel.inputs.textContent);
          console.log(mod.run(main.inputsPanel.inputs.textContent));
        });
      }

      this.bufs = {};
      var bufs = this.bufs;

      this.panel = atom.workspace.addLeftPanel({
        item: this.blockView,
        visible: true,
        priority: 0
      });

      this.rpanel = atom.workspace.addRightPanel({
        item: this.inputsPanel,
        visible: true,
        priority: 0
      });

      atom.workspace.observeTextEditors(function (e) {
        console.log(e.getPath());
        var p = e.getPath();
        if (p != null && e.getPath().endsWith("block_code.js")) {
          e.onDidSave(function (event) {
            console.log("SAVE " + p + bufs[p]);
            request.post('http://localhost:3000/api/publish', {
              form: {
                pid: 'aQvJm8lP9VRMkn6WD',
                eid: bufs[p]
              }
            });
          });

        }
      });

      this.disposables.add(
        atom.commands.add(
          'atom-workspace', {
            'microcosm:loadProject': this.loadProject.bind(this),
          }
        )
      );
    }

    deactivate() {
      this.disposables.dispose();
      this.panel.destroy();
    }

    loadProject() {
      var t = this;
      var bls = [];
      var translate = function (name) {
        var res = name.replace('/', '_').replace('@', '_at_');
        return res;
      }

      request('http://localhost:3000/api/blocks/?pid=aQvJm8lP9VRMkn6WD',
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var bd = JSON.parse(body);

            for (var b in bd) {
              bls.push({
                name: b,
                val: translate(b)
              });
            }
          }
          t.blockView.setBlocks(t, bls);
        });

      request.post('http://localhost:3000/api/fetch_project', {
          form: {
            pid: 'aQvJm8lP9VRMkn6WD'
          }
        },
        function (error, resp, body) {
          if (!error && resp.statusCode == 200) {
            t.blocksPath = JSON.parse(body)['path'];
            console.log(t.blocksPath);
          }
        });
    }

    openBlock(t, b) {
      console.log("OPEN: " + b);
      var p = this.blocksPath + '/' + b + '/block_code.js';
      this.bufs[p] = t;
      this.currentFile = p;
      atom.workspace.open(p);
    }

  }

  mainModel = new MainModel();
  module.exports = mainModel;
}());
