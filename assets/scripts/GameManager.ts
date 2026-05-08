import {
    _decorator,
    Component,
    EventKeyboard,
    EventTouch,
    Input,
    KeyCode,
    Label,
    Node,
    Prefab,
    Tween,
    UIOpacity,
    Vec3,
    instantiate,
    input,
    sys,
    tween,
} from 'cc';
import { TileView } from './TileView';
const { ccclass, property } = _decorator;

type Direction = 'left' | 'right' | 'up' | 'down';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    tileLayer: Node | null = null;

    @property(Prefab)
    tilePrefab: Prefab | null = null;

    @property(Label)
    scoreLabel: Label | null = null;

    @property(Label)
    bestLabel: Label | null = null;

    @property(Node)
    scorePanel: Node | null = null;

    @property(Label)
    scoreGainLabel: Label | null = null;

    @property(Node)
    gameOverPanel: Node | null = null;

    @property(Node)
    gameOverOverlayBg: Node | null = null;

    @property(Node)
    gameOverContent: Node | null = null;

    @property
    size = 4;

    @property
    boardPixelSize = 560;

    @property
    cellSize = 120;

    @property
    gap = 16;

    @property
    swipeMinDistance = 18;

    @property
    swipeDirectionRatio = 1.12;

    private grid: number[][] = [];
    private tileNodes: (Node | null)[][] = [];
    private score = 0;
    private best = 0;
    private touchStartX = 0;
    private touchStartY = 0;
    private hasTouchStart = false;
    private scoreGainBasePos: Vec3 | null = null;
    private isAnimating = false;

    private readonly slideDuration = 0.12;
    private readonly postSlideLockDuration = 0.16;

    onEnable() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        const touchTarget = this.tileLayer ?? this.node;
        touchTarget.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        touchTarget.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        touchTarget.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        const touchTarget = this.tileLayer ?? this.node;
        touchTarget.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        touchTarget.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        touchTarget.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        const savedBest = sys.localStorage.getItem('best2048');
        this.best = savedBest ? Number(savedBest) : 0;
        if (this.scoreGainLabel) {
            this.scoreGainBasePos = this.scoreGainLabel.node.position.clone();
        }
        this.newGame();
    }

    public newGame() {
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

    private onKeyDown(event: EventKeyboard) {
        if (this.gameOverPanel?.active || this.isAnimating) {
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

    private onTouchStart(event: EventTouch) {
        if (this.gameOverPanel?.active || this.isAnimating) {
            return;
        }

        const pos = event.getUILocation();
        this.touchStartX = pos.x;
        this.touchStartY = pos.y;
        this.hasTouchStart = true;
    }

    private onTouchEnd(event: EventTouch) {
        if (this.gameOverPanel?.active || this.isAnimating || !this.hasTouchStart) {
            return;
        }

        const pos = event.getUILocation();
        this.handleSwipe(pos.x, pos.y);
    }

    private onTouchCancel(event: EventTouch) {
        if (this.gameOverPanel?.active || this.isAnimating || !this.hasTouchStart) {
            return;
        }

        const pos = event.getUILocation();
        this.handleSwipe(pos.x, pos.y);
    }

    private handleSwipe(endX: number, endY: number) {
        const dx = endX - this.touchStartX;
        const dy = endY - this.touchStartY;
        this.hasTouchStart = false;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const minDistance = Math.max(8, this.swipeMinDistance);
        const axisRatio = Math.max(1, this.swipeDirectionRatio);

        // Nhẹ tay vẫn nhận, nhưng tap/drag ngắn sẽ không gây move.
        if (Math.max(absX, absY) < minDistance) {
            return;
        }

        // Tránh nhận nhầm khi vuốt chéo quá cân bằng.
        if (absX > absY * axisRatio) {
            this.move(dx > 0 ? 'right' : 'left');
            return;
        }

        if (absY > absX * axisRatio) {
            this.move(dy > 0 ? 'up' : 'down');
            return;
        }

        // Trường hợp chéo gần cân bằng: ưu tiên trục lớn hơn.
        if (absX >= absY) this.move(dx > 0 ? 'right' : 'left');
        else this.move(dy > 0 ? 'up' : 'down');
    }

    private move(direction: Direction) {
        if (!this.tileLayer || !this.tilePrefab) {
            return;
        }

        const { moved, gainedScore, mergedTargets, nextGrid, nextTileNodes, animationsDone } =
            this.applyMoveWithNodes(direction);

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
                const tv = node.getComponent(TileView);
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
            }

            // Keep lock a bit longer so merge/spawn pop cannot be interrupted mid-scale.
            tween(this.node)
                .delay(this.postSlideLockDuration)
                .call(() => {
                    this.isAnimating = false;
                })
                .start();
        });
    }

    private spawnRandomTile(): { r: number; c: number; value: number } | null {
        const emptyCells: { r: number; c: number }[] = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({ r, c });
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
        return { r: cell.r, c: cell.c, value };
    }

    private createTileNode(r: number, c: number, value: number, playSpawnPop: boolean) {
        if (!this.tileLayer || !this.tilePrefab) return;

        const tile = instantiate(this.tilePrefab);
        this.tileLayer.addChild(tile);
        tile.setPosition(this.getCellPosition(r, c));
        this.tileNodes[r][c] = tile;

        const tileView = tile.getComponent(TileView);
        if (tileView) {
            tileView.setValue(value);
        }

        if (playSpawnPop) {
            this.playSpawnPop(tile);
        }
    }

    private playSpawnPop(tile: Node) {
        Tween.stopAllByTarget(tile);
        tile.setScale(new Vec3(0.75, 0.75, 1));
        tween(tile)
            .to(0.08, { scale: new Vec3(1.08, 1.08, 1) })
            .to(0.06, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    private playMergePop(tile: Node) {
        Tween.stopAllByTarget(tile);
        tile.setScale(new Vec3(1, 1, 1));
        tween(tile)
            .to(0.08, { scale: new Vec3(1.15, 1.15, 1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    private applyMoveWithNodes(direction: Direction): {
        moved: boolean;
        gainedScore: number;
        mergedTargets: Array<{ r: number; c: number; value: number }>;
        nextGrid: number[][];
        nextTileNodes: (Node | null)[][];
        animationsDone: (cb: () => void) => void;
    } {
        const size = this.size;
        const nextGrid: number[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
        const nextNodes: (Node | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

        const mergedTargets: Array<{ r: number; c: number; value: number }> = [];
        const nodesToDestroy: Node[] = [];
        let gainedScore = 0;
        let moved = false;

        const animatedNodes: Node[] = [];

        const getRC = (lineIndex: number, i: number): { r: number; c: number } => {
            switch (direction) {
                case 'left':
                    return { r: lineIndex, c: i };
                case 'right':
                    return { r: lineIndex, c: size - 1 - i };
                case 'up':
                    return { r: i, c: lineIndex };
                case 'down':
                    return { r: size - 1 - i, c: lineIndex };
            }
        };

        for (let lineIndex = 0; lineIndex < size; lineIndex++) {
            const items: Array<{ value: number; node: Node }> = [];
            for (let i = 0; i < size; i++) {
                const { r, c } = getRC(lineIndex, i);
                const v = this.grid[r][c];
                const n = this.tileNodes[r][c];
                if (v !== 0 && n) {
                    items.push({ value: v, node: n });
                }
            }

            let writeI = 0;
            for (let k = 0; k < items.length; k++) {
                const cur = items[k];
                const nxt = items[k + 1];

                if (nxt && cur.value === nxt.value) {
                    const targetValue = cur.value * 2;
                    const { r: tr, c: tc } = getRC(lineIndex, writeI);

                    nextGrid[tr][tc] = targetValue;
                    nextNodes[tr][tc] = cur.node;
                    mergedTargets.push({ r: tr, c: tc, value: targetValue });
                    gainedScore += targetValue;

                    const to = this.getCellPosition(tr, tc);

                    Tween.stopAllByTarget(cur.node);
                    cur.node.setScale(new Vec3(1, 1, 1));
                    if (!cur.node.position.equals(to)) moved = true;
                    tween(cur.node).to(this.slideDuration, { position: to }).start();
                    animatedNodes.push(cur.node);

                    Tween.stopAllByTarget(nxt.node);
                    nxt.node.setScale(new Vec3(1, 1, 1));
                    if (!nxt.node.position.equals(to)) moved = true;
                    tween(nxt.node)
                        .to(this.slideDuration, { position: to })
                        .call(() => nodesToDestroy.push(nxt.node))
                        .start();
                    animatedNodes.push(nxt.node);

                    k++;
                    writeI++;
                } else {
                    const { r: tr, c: tc } = getRC(lineIndex, writeI);
                    nextGrid[tr][tc] = cur.value;
                    nextNodes[tr][tc] = cur.node;

                    const to = this.getCellPosition(tr, tc);
                    Tween.stopAllByTarget(cur.node);
                    cur.node.setScale(new Vec3(1, 1, 1));
                    if (!cur.node.position.equals(to)) moved = true;
                    tween(cur.node).to(this.slideDuration, { position: to }).start();
                    animatedNodes.push(cur.node);
                    writeI++;
                }
            }
        }

        const animationsDone = (cb: () => void) => {
            if (animatedNodes.length === 0) {
                for (const dn of nodesToDestroy) dn.destroy();
                cb();
                return;
            }

            let left = animatedNodes.length;
            for (const n of animatedNodes) {
                tween(n)
                    .delay(this.slideDuration)
                    .call(() => {
                        left--;
                        if (left === 0) {
                            for (const dn of nodesToDestroy) dn.destroy();
                            cb();
                        }
                    })
                    .start();
            }
        };

        return {
            moved,
            gainedScore,
            mergedTargets,
            nextGrid,
            nextTileNodes: nextNodes,
            animationsDone,
        };
    }

    private getCellPosition(row: number, col: number): Vec3 {
        const x = -this.boardPixelSize / 2 + this.gap + this.cellSize / 2 + col * (this.cellSize + this.gap);
        const y = this.boardPixelSize / 2 - this.gap - this.cellSize / 2 - row * (this.cellSize + this.gap);
        return new Vec3(x, y, 0);
    }

    private updateScore(gainedScore = 0) {
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

    private playScoreAnim() {
        if (!this.scorePanel) {
            return;
        }

        Tween.stopAllByTarget(this.scorePanel);
        this.scorePanel.setScale(new Vec3(1, 1, 1));
        tween(this.scorePanel)
            .to(0.08, { scale: new Vec3(1.08, 1.08, 1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    private playScoreGainText(gainedScore: number) {
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

        const opacity = gainNode.getComponent(UIOpacity) ?? gainNode.addComponent(UIOpacity);
        opacity.opacity = 255;
        Tween.stopAllByTarget(gainNode);
        Tween.stopAllByTarget(opacity);

        tween(gainNode)
            .parallel(
                tween().to(0.42, { position: new Vec3(startPos.x, startPos.y + 18, startPos.z) }),
                tween(opacity).to(0.42, { opacity: 0 }),
            )
            .call(() => {
                gainNode.setPosition(startPos);
            })
            .start();
    }

    private showGameOver() {
        if (!this.gameOverPanel) {
            return;
        }

        this.gameOverPanel.active = true;

        if (this.gameOverContent) {
            this.gameOverContent.active = false;
        }

        const overlayNode = this.gameOverOverlayBg ?? this.gameOverPanel;
        const overlayOpacity = overlayNode.getComponent(UIOpacity) ?? overlayNode.addComponent(UIOpacity);
        Tween.stopAllByTarget(overlayOpacity);
        overlayOpacity.opacity = 0;

        if (this.gameOverContent) {
            const contentOpacity =
                this.gameOverContent.getComponent(UIOpacity) ?? this.gameOverContent.addComponent(UIOpacity);
            contentOpacity.opacity = 255;
        }

        tween(overlayOpacity)
            // Fade mờ nền trong khoảng ~1s trước khi hiện nội dung game over.
            .to(1.0, { opacity: 185 })
            .call(() => {
                if (!this.gameOverContent) {
                    return;
                }

                this.gameOverContent.active = true;
                this.gameOverContent.setScale(new Vec3(0.9, 0.9, 1));
                Tween.stopAllByTarget(this.gameOverContent);
                tween(this.gameOverContent)
                    .to(0.12, { scale: new Vec3(1.05, 1.05, 1) })
                    .to(0.08, { scale: new Vec3(1, 1, 1) })
                    .start();
            })
            .start();
    }

    public onTryAgainClicked() {
        this.newGame();
    }

    private copyGrid(grid: number[][]): number[][] {
        return grid.map((row) => [...row]);
    }

    private isSameGrid(a: number[][], b: number[][]): boolean {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (a[r][c] !== b[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }

    private isGameOver(): boolean {
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
}

