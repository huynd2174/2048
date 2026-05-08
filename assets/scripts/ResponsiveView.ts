import { _decorator, Camera, Component, Rect, ResolutionPolicy, find, view } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ResponsiveView')
export class ResponsiveView extends Component {
    private readonly designWidth = 640;
    private readonly designHeight = 960;

    @property({
        type: Camera,
        tooltip: 'Camera gameplay cần letterbox theo tỉ lệ thiết kế',
    })
    public targetCamera: Camera | null = null;

    private readonly onResize = () => {
        const frame = view.getFrameSize();
        const designAspect = this.designWidth / this.designHeight;
        const screenAspect = frame.height > 0 ? frame.width / frame.height : designAspect;

        // FIXED_HEIGHT sẽ "crop ngang" khi màn hình quá hẹp (mobile dọc siêu dài).
        // FIXED_WIDTH sẽ "crop dọc" khi màn hình quá rộng.
        // Chọn policy theo tỉ lệ để tránh crop UI (ưu tiên không cắt nội dung).
        const policy =
            screenAspect < designAspect ? ResolutionPolicy.FIXED_WIDTH : ResolutionPolicy.FIXED_HEIGHT;

        view.setDesignResolutionSize(this.designWidth, this.designHeight, policy);

        this.applyCameraViewport();
    };

    onLoad() {
        if (!this.targetCamera) {
            this.targetCamera =
                find('Canvas/Camera')?.getComponent(Camera) ??
                find('Camera')?.getComponent(Camera) ??
                null;
        }
        this.onResize();
        view.on('canvas-resize', this.onResize, this);
    }

    onDestroy() {
        view.off('canvas-resize', this.onResize, this);
    }

    private applyCameraViewport() {
        if (!this.targetCamera) return;

        const frame = view.getFrameSize();
        if (frame.width <= 0 || frame.height <= 0) return;

        const screenAspect = frame.width / frame.height;
        const designAspect = this.designWidth / this.designHeight;

        // Letterbox chỉ khi màn hình quá rộng (thường là web landscape).
        if (screenAspect > designAspect) {
            // Màn hình rộng: giữ full height, thu hẹp width và căn giữa (2 viền đen hai bên).
            const w = designAspect / screenAspect;
            const x = (1 - w) * 0.5;
            this.targetCamera.rect = new Rect(x, 0, w, 1);
        } else {
            this.targetCamera.rect = new Rect(0, 0, 1, 1);
        }
    }
}
