System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Label, Sprite, UIOpacity, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, TileView;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      UIOpacity = _cc.UIOpacity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4bb2cEdJgBBAr5T2DljWhxc", "TileView", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Label', 'Sprite', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TileView", TileView = (_dec = ccclass('TileView'), _dec2 = property(Label), _dec3 = property(Sprite), _dec(_class = (_class2 = class TileView extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "valueLabel", _descriptor, this);

          _initializerDefineProperty(this, "bgSprite", _descriptor2, this);

          this.value = 0;
        }

        setValue(value) {
          this.value = value;

          if (this.valueLabel) {
            this.valueLabel.string = value > 0 ? "" + value : '';
          }

          var opacity = this.getComponent(UIOpacity);

          if (opacity) {
            opacity.opacity = value > 0 ? 255 : 0;
          }

          if (this.bgSprite) {
            this.bgSprite.color = this.getColorByValue(value);
          }
        }

        getValue() {
          return this.value;
        }

        getColorByValue(value) {
          switch (value) {
            case 0:
              return new Color(205, 193, 180, 255);

            case 2:
              return new Color(238, 228, 218, 255);

            case 4:
              return new Color(237, 224, 200, 255);

            case 8:
              return new Color(242, 177, 121, 255);

            case 16:
              return new Color(245, 149, 99, 255);

            case 32:
              return new Color(246, 124, 95, 255);

            case 64:
              return new Color(246, 94, 59, 255);

            case 128:
              return new Color(237, 207, 114, 255);

            case 256:
              return new Color(237, 204, 97, 255);

            case 512:
              return new Color(237, 200, 80, 255);

            case 1024:
              return new Color(237, 197, 63, 255);

            case 2048:
              return new Color(237, 194, 46, 255);

            default:
              return new Color(60, 58, 50, 255);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "valueLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bgSprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cfe71076bdff9c528ef128cbaf575f8e8427d6ff.js.map