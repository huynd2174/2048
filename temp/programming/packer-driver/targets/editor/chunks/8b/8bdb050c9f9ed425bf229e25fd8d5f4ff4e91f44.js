System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, Rect, ResolutionPolicy, find, view, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ResponsiveView;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      Rect = _cc.Rect;
      ResolutionPolicy = _cc.ResolutionPolicy;
      find = _cc.find;
      view = _cc.view;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "baae4P4O3tOmbp0pEobnMNb", "ResponsiveView", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'Rect', 'ResolutionPolicy', 'find', 'view']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ResponsiveView", ResponsiveView = (_dec = ccclass('ResponsiveView'), _dec2 = property({
        type: Camera,
        tooltip: 'Camera gameplay cần letterbox theo tỉ lệ thiết kế'
      }), _dec(_class = (_class2 = class ResponsiveView extends Component {
        constructor(...args) {
          super(...args);
          this.designWidth = 640;
          this.designHeight = 960;

          _initializerDefineProperty(this, "targetCamera", _descriptor, this);

          this.onResize = () => {
            const frame = view.getFrameSize();
            const designAspect = this.designWidth / this.designHeight;
            const screenAspect = frame.height > 0 ? frame.width / frame.height : designAspect; // FIXED_HEIGHT sẽ "crop ngang" khi màn hình quá hẹp (mobile dọc siêu dài).
            // FIXED_WIDTH sẽ "crop dọc" khi màn hình quá rộng.
            // Chọn policy theo tỉ lệ để tránh crop UI (ưu tiên không cắt nội dung).

            const policy = screenAspect < designAspect ? ResolutionPolicy.FIXED_WIDTH : ResolutionPolicy.FIXED_HEIGHT;
            view.setDesignResolutionSize(this.designWidth, this.designHeight, policy);
            this.applyCameraViewport();
          };
        }

        onLoad() {
          if (!this.targetCamera) {
            var _ref, _find$getComponent, _find, _find2;

            this.targetCamera = (_ref = (_find$getComponent = (_find = find('Canvas/Camera')) == null ? void 0 : _find.getComponent(Camera)) != null ? _find$getComponent : (_find2 = find('Camera')) == null ? void 0 : _find2.getComponent(Camera)) != null ? _ref : null;
          }

          this.onResize();
          view.on('canvas-resize', this.onResize, this);
        }

        onDestroy() {
          view.off('canvas-resize', this.onResize, this);
        }

        applyCameraViewport() {
          if (!this.targetCamera) return;
          const frame = view.getFrameSize();
          if (frame.width <= 0 || frame.height <= 0) return;
          const screenAspect = frame.width / frame.height;
          const designAspect = this.designWidth / this.designHeight; // Letterbox chỉ khi màn hình quá rộng (thường là web landscape).

          if (screenAspect > designAspect) {
            // Màn hình rộng: giữ full height, thu hẹp width và căn giữa (2 viền đen hai bên).
            const w = designAspect / screenAspect;
            const x = (1 - w) * 0.5;
            this.targetCamera.rect = new Rect(x, 0, w, 1);
          } else {
            this.targetCamera.rect = new Rect(0, 0, 1, 1);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8bdb050c9f9ed425bf229e25fd8d5f4ff4e91f44.js.map