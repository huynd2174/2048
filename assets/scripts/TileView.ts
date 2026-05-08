import { _decorator, Color, Component, Label, Sprite, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TileView')
export class TileView extends Component {
    @property(Label)
    valueLabel: Label | null = null;

    @property(Sprite)
    bgSprite: Sprite | null = null;

    private value = 0;

    public setValue(value: number) {
        this.value = value;

        if (this.valueLabel) {
            this.valueLabel.string = value > 0 ? `${value}` : '';
        }

        const opacity = this.getComponent(UIOpacity);
        if (opacity) {
            opacity.opacity = value > 0 ? 255 : 0;
        }

        if (this.bgSprite) {
            this.bgSprite.color = this.getColorByValue(value);
        }
    }

    public getValue(): number {
        return this.value;
    }

    private getColorByValue(value: number): Color {
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
}


