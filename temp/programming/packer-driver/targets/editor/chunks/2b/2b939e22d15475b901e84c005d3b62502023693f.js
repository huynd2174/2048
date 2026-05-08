System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, KeyCode, Label, Node, Prefab, Tween, UIOpacity, Vec3, instantiate, input, sys, tween, TileView, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfTileView(extras) {
    _reporterNs.report("TileView", "./TileView", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Input = _cc.Input;
      KeyCode = _cc.KeyCode;
      Label = _cc.Label;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      Tween = _cc.Tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
      instantiate = _cc.instantiate;
      input = _cc.input;
      sys = _cc.sys;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      TileView = _unresolved_2.TileView;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "72eb0r69x1AII2nnjEPUqJv", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventKeyboard', 'EventTouch', 'Input', 'KeyCode', 'Label', 'Node', 'Prefab', 'Tween', 'UIOpacity', 'Vec3', 'instantiate', 'input', 'sys', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Node), _dec7 = property(Label), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec(_class = (_class2 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tileLayer", _descriptor, this);

          _initializerDefineProperty(this, "tilePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "scoreLabel", _descriptor3, this);

          _initializerDefineProperty(this, "bestLabel", _descriptor4, this);

          _initializerDefineProperty(this, "scorePanel", _descriptor5, this);

          _initializerDefineProperty(this, "scoreGainLabel", _descriptor6, this);

          _initializerDefineProperty(this, "gameOverPanel", _descriptor7, this);

          _initializerDefineProperty(this, "gameOverOverlayBg", _descriptor8, this);

          _initializerDefineProperty(this, "gameOverContent", _descriptor9, this);

          _initializerDefineProperty(this, "size", _descriptor10, this);

          _initializerDefineProperty(this, "boardPixelSize", _descriptor11, this);

          _initializerDefineProperty(this, "cellSize", _descriptor12, this);

          _initializerDefineProperty(this, "gap", _descriptor13, this);

          this.grid = [];
          this.tileNodes = [];
          this.score = 0;
          this.best = 0;
          this.touchStartX = 0;
          this.touchStartY = 0;
          this.scoreGainBasePos = null;
          this.isAnimating = false;
          this.slideDuration = 0.12;
          this.postSlideLockDuration = 0.16;
        }

        onEnable() {
          var _this$tileLayer;

          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          const touchTarget = (_this$tileLayer = this.tileLayer) != null ? _this$tileLayer : this.node;
          touchTarget.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          touchTarget.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        onDisable() {
          var _this$tileLayer2;

          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          const touchTarget = (_this$tileLayer2 = this.tileLayer) != null ? _this$tileLayer2 : this.node;
          touchTarget.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          touchTarget.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        start() {
          const savedBest = sys.localStorage.getItem('best2048');
          this.best = savedBest ? Number(savedBest) : 0;

          if (this.scoreGainLabel) {
            this.scoreGainBasePos = this.scoreGainLabel.node.position.clone();
          }

          this.newGame();
        }

        newGame() {
          this.score = 0;
          this.isAnimating = false;

          if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
          }

          this.grid = [];
          this.tileNodes = [];

          for (let r = 0; r < this.size; r++) {
            this.grid[r] = [];
            this.tileNodes[r] = [];

            for (let c = 0; c < this.size; c++) {
              this.grid[r][c] = 0;
              this.tileNodes[r][c] = null;
            }
          }

          if (this.tileLayer) {
            this.tileLayer.removeAllChildren();
          }

          const a = this.spawnRandomTile();
          const b = this.spawnRandomTile();
          this.updateScore();
          if (a) this.createTileNode(a.r, a.c, a.value, true);
          if (b) this.createTileNode(b.r, b.c, b.value, true);
        }

        onKeyDown(event) {
          var _this$gameOverPanel;

          if ((_this$gameOverPanel = this.gameOverPanel) != null && _this$gameOverPanel.active || this.isAnimating) {
            return;
          }

          switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
              this.move('left');
              break;

            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
              this.move('right');
              break;

            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
              this.move('up');
              break;

            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
              this.move('down');
              break;

            case KeyCode.KEY_R:
              this.newGame();
              break;

            default:
              break;
          }
        }

        onTouchStart(event) {
          var _this$gameOverPanel2;

          if ((_this$gameOverPanel2 = this.gameOverPanel) != null && _this$gameOverPanel2.active || this.isAnimating) {
            return;
          }

          const pos = event.getUILocation();
          this.touchStartX = pos.x;
          this.touchStartY = pos.y;
        }

        onTouchEnd(event) {
          var _this$gameOverPanel3;

          if ((_this$gameOverPanel3 = this.gameOverPanel) != null && _this$gameOverPanel3.active || this.isAnimating) {
            return;
          }

          const pos = event.getUILocation();
          const dx = pos.x - this.touchStartX;
          const dy = pos.y - this.touchStartY;

          if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
            return;
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            this.move(dx > 0 ? 'right' : 'left');
          } else {
            this.move(dy > 0 ? 'up' : 'down');
          }
        }

        move(direction) {
          if (!this.tileLayer || !this.tilePrefab) {
            return;
          }

          const {
            moved,
            gainedScore,
            mergedTargets,
            nextGrid,
            nextTileNodes,
            animationsDone
          } = this.applyMoveWithNodes(direction);

          if (!moved) {
            return;
          }

          this.isAnimating = true;
          animationsDone(() => {
            this.grid = nextGrid;
            this.tileNodes = nextTileNodes;

            for (const t of mergedTargets) {
              const node = this.tileNodes[t.r][t.c];
              if (!node) continue;
              const tv = node.getComponent(_crd && TileView === void 0 ? (_reportPossibleCrUseOfTileView({
                error: Error()
              }), TileView) : TileView);
              if (tv) tv.setValue(t.value);
              this.playMergePop(node);
            }

            const spawned = this.spawnRandomTile();

            if (spawned) {
              this.createTileNode(spawned.r, spawned.c, spawned.value, true);
            }

            if (gainedScore > 0) {
              this.score += gainedScore;
            }

            this.updateScore(gainedScore);
            const gameOver = this.isGameOver();

            if (gameOver) {
              this.showGameOver();
            } // Keep lock a bit longer so merge/spawn pop cannot be interrupted mid-scale.


            tween(this.node).delay(this.postSlideLockDuration).call(() => {
              this.isAnimating = false;
            }).start();
          });
        }

        spawnRandomTile() {
          const emptyCells = [];

          for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
              if (this.grid[r][c] === 0) {
                emptyCells.push({
                  r,
                  c
                });
              }
            }
          }

          if (emptyCells.length === 0) {
            return null;
          }

          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const cell = emptyCells[randomIndex];
          const value = Math.random() < 0.9 ? 2 : 4;
          this.grid[cell.r][cell.c] = value;
          return {
            r: cell.r,
            c: cell.c,
            value
          };
        }

        createTileNode(r, c, value, playSpawnPop) {
          if (!this.tileLayer || !this.tilePrefab) return;
          const tile = instantiate(this.tilePrefab);
          this.tileLayer.addChild(tile);
          tile.setPosition(this.getCellPosition(r, c));
          this.tileNodes[r][c] = tile;
          const tileView = tile.getComponent(_crd && TileView === void 0 ? (_reportPossibleCrUseOfTileView({
            error: Error()
          }), TileView) : TileView);

          if (tileView) {
            tileView.setValue(value);
          }

          if (playSpawnPop) {
            this.playSpawnPop(tile);
          }
        }

        playSpawnPop(tile) {
          Tween.stopAllByTarget(tile);
          tile.setScale(new Vec3(0.75, 0.75, 1));
          tween(tile).to(0.08, {
            scale: new Vec3(1.08, 1.08, 1)
          }).to(0.06, {
            scale: new Vec3(1, 1, 1)
          }).start();
        }

        playMergePop(tile) {
          Tween.stopAllByTarget(tile);
          tile.setScale(new Vec3(1, 1, 1));
          tween(tile).to(0.08, {
            scale: new Vec3(1.15, 1.15, 1)
          }).to(0.08, {
            scale: new Vec3(1, 1, 1)
          }).start();
        }

        applyMoveWithNodes(direction) {
          const size = this.size;
          const nextGrid = Array.from({
            length: size
          }, () => Array.from({
            length: size
          }, () => 0));
          const nextNodes = Array.from({
            length: size
          }, () => Array.from({
            length: size
          }, () => null));
          const mergedTargets = [];
          const nodesToDestroy = [];
          let gainedScore = 0;
          let moved = false;
          const animatedNodes = [];

          const getRC = (lineIndex, i) => {
            switch (direction) {
              case 'left':
                return {
                  r: lineIndex,
                  c: i
                };

              case 'right':
                return {
                  r: lineIndex,
                  c: size - 1 - i
                };

              case 'up':
                return {
                  r: i,
                  c: lineIndex
                };

              case 'down':
                return {
                  r: size - 1 - i,
                  c: lineIndex
                };
            }
          };

          for (let lineIndex = 0; lineIndex < size; lineIndex++) {
            const items = [];

            for (let i = 0; i < size; i++) {
              const {
                r,
                c
              } = getRC(lineIndex, i);
              const v = this.grid[r][c];
              const n = this.tileNodes[r][c];

              if (v !== 0 && n) {
                items.push({
                  value: v,
                  node: n
                });
              }
            }

            let writeI = 0;

            for (let k = 0; k < items.length; k++) {
              const cur = items[k];
              const nxt = items[k + 1];

              if (nxt && cur.value === nxt.value) {
                const targetValue = cur.value * 2;
                const {
                  r: tr,
                  c: tc
                } = getRC(lineIndex, writeI);
                nextGrid[tr][tc] = targetValue;
                nextNodes[tr][tc] = cur.node;
                mergedTargets.push({
                  r: tr,
                  c: tc,
                  value: targetValue
                });
                gainedScore += targetValue;
                const to = this.getCellPosition(tr, tc);
                Tween.stopAllByTarget(cur.node);
                cur.node.setScale(new Vec3(1, 1, 1));
                if (!cur.node.position.equals(to)) moved = true;
                tween(cur.node).to(this.slideDuration, {
                  position: to
                }).start();
                animatedNodes.push(cur.node);
                Tween.stopAllByTarget(nxt.node);
                nxt.node.setScale(new Vec3(1, 1, 1));
                if (!nxt.node.position.equals(to)) moved = true;
                tween(nxt.node).to(this.slideDuration, {
                  position: to
                }).call(() => nodesToDestroy.push(nxt.node)).start();
                animatedNodes.push(nxt.node);
                k++;
                writeI++;
              } else {
                const {
                  r: tr,
                  c: tc
                } = getRC(lineIndex, writeI);
                nextGrid[tr][tc] = cur.value;
                nextNodes[tr][tc] = cur.node;
                const to = this.getCellPosition(tr, tc);
                Tween.stopAllByTarget(cur.node);
                cur.node.setScale(new Vec3(1, 1, 1));
                if (!cur.node.position.equals(to)) moved = true;
                tween(cur.node).to(this.slideDuration, {
                  position: to
                }).start();
                animatedNodes.push(cur.node);
                writeI++;
              }
            }
          }

          const animationsDone = cb => {
            if (animatedNodes.length === 0) {
              for (const dn of nodesToDestroy) dn.destroy();

              cb();
              return;
            }

            let left = animatedNodes.length;

            for (const n of animatedNodes) {
              tween(n).delay(this.slideDuration).call(() => {
                left--;

                if (left === 0) {
                  for (const dn of nodesToDestroy) dn.destroy();

                  cb();
                }
              }).start();
            }
          };

          return {
            moved,
            gainedScore,
            mergedTargets,
            nextGrid,
            nextTileNodes: nextNodes,
            animationsDone
          };
        }

        getCellPosition(row, col) {
          const x = -this.boardPixelSize / 2 + this.gap + this.cellSize / 2 + col * (this.cellSize + this.gap);
          const y = this.boardPixelSize / 2 - this.gap - this.cellSize / 2 - row * (this.cellSize + this.gap);
          return new Vec3(x, y, 0);
        }

        updateScore(gainedScore = 0) {
          if (this.score > this.best) {
            this.best = this.score;
            sys.localStorage.setItem('best2048', String(this.best));
          }

          if (this.scoreLabel) {
            this.scoreLabel.string = String(this.score);
          }

          if (this.bestLabel) {
            this.bestLabel.string = String(this.best);
          }

          this.playScoreAnim();

          if (gainedScore > 0) {
            this.playScoreGainText(gainedScore);
          }
        }

        playScoreAnim() {
          if (!this.scorePanel) {
            return;
          }

          Tween.stopAllByTarget(this.scorePanel);
          this.scorePanel.setScale(new Vec3(1, 1, 1));
          tween(this.scorePanel).to(0.08, {
            scale: new Vec3(1.08, 1.08, 1)
          }).to(0.08, {
            scale: new Vec3(1, 1, 1)
          }).start();
        }

        playScoreGainText(gainedScore) {
          var _gainNode$getComponen;

          if (!this.scoreGainLabel) {
            return;
          }

          this.scoreGainLabel.string = `+${gainedScore}`;
          const gainNode = this.scoreGainLabel.node;

          if (!this.scoreGainBasePos) {
            this.scoreGainBasePos = gainNode.position.clone();
          }

          const startPos = this.scoreGainBasePos.clone();
          gainNode.setPosition(startPos);
          const opacity = (_gainNode$getComponen = gainNode.getComponent(UIOpacity)) != null ? _gainNode$getComponen : gainNode.addComponent(UIOpacity);
          opacity.opacity = 255;
          Tween.stopAllByTarget(gainNode);
          Tween.stopAllByTarget(opacity);
          tween(gainNode).parallel(tween().to(0.42, {
            position: new Vec3(startPos.x, startPos.y + 18, startPos.z)
          }), tween(opacity).to(0.42, {
            opacity: 0
          })).call(() => {
            gainNode.setPosition(startPos);
          }).start();
        }

        showGameOver() {
          var _this$gameOverOverlay, _overlayNode$getCompo;

          if (!this.gameOverPanel) {
            return;
          }

          this.gameOverPanel.active = true;

          if (this.gameOverContent) {
            this.gameOverContent.active = false;
          }

          const overlayNode = (_this$gameOverOverlay = this.gameOverOverlayBg) != null ? _this$gameOverOverlay : this.gameOverPanel;
          const overlayOpacity = (_overlayNode$getCompo = overlayNode.getComponent(UIOpacity)) != null ? _overlayNode$getCompo : overlayNode.addComponent(UIOpacity);
          Tween.stopAllByTarget(overlayOpacity);
          overlayOpacity.opacity = 0;

          if (this.gameOverContent) {
            var _this$gameOverContent;

            const contentOpacity = (_this$gameOverContent = this.gameOverContent.getComponent(UIOpacity)) != null ? _this$gameOverContent : this.gameOverContent.addComponent(UIOpacity);
            contentOpacity.opacity = 255;
          }

          tween(overlayOpacity) // Fade mờ nền trong khoảng ~1s trước khi hiện nội dung game over.
          .to(1.0, {
            opacity: 185
          }).call(() => {
            if (!this.gameOverContent) {
              return;
            }

            this.gameOverContent.active = true;
            this.gameOverContent.setScale(new Vec3(0.9, 0.9, 1));
            Tween.stopAllByTarget(this.gameOverContent);
            tween(this.gameOverContent).to(0.12, {
              scale: new Vec3(1.05, 1.05, 1)
            }).to(0.08, {
              scale: new Vec3(1, 1, 1)
            }).start();
          }).start();
        }

        onTryAgainClicked() {
          this.newGame();
        }

        copyGrid(grid) {
          return grid.map(row => [...row]);
        }

        isSameGrid(a, b) {
          for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
              if (a[r][c] !== b[r][c]) {
                return false;
              }
            }
          }

          return true;
        }

        isGameOver() {
          for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
              if (this.grid[r][c] === 0) {
                return false;
              }

              if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) {
                return false;
              }

              if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) {
                return false;
              }
            }
          }

          return true;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tileLayer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tilePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bestLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scorePanel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "scoreGainLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gameOverPanel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gameOverOverlayBg", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "gameOverContent", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "size", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "boardPixelSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 560;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "cellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 120;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "gap", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2b939e22d15475b901e84c005d3b62502023693f.js.map