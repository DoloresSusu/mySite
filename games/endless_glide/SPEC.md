# 技术规格文档：无尽滑行 (Endless Glide)

## 1. 交互逻辑 (Interaction Logic)

- **控制输入**：
  - 游戏 SHALL 监听 `keydown` (Space), `mousedown`, 及 `touchstart` 事件作为统一的“向上滑行”指令。
  - WHEN 玩家触发输入，THEN 角色增加垂直向上的瞬时加速度（力）。
  - WHEN 输入释放，THEN 角色仅受重力影响。
- **运动物理引擎**：
  - 角色 SHALL 维持恒定的水平向右位移增量（速度 $V_x$）。
  - 垂直位移（$Y$轴）SHALL 遵循经典运动学公式：$y_{new} = y_{old} + V_y \cdot dt + 0.5 \cdot a \cdot dt^2$。
  - 垂直速度 $V_y$ SHALL 受到固定重力加速度 $g$ 与上升力 $F_{lift}$ 的共同作用。
  - 垂直速度 SHALL 设有全局最大值上限（Terminal Velocity），以维持操作的连贯性。
- **碰撞响应**：
  - WHEN 角色包围盒（AABB 或 Circle）与地形路径或障碍物发生重叠，THEN 判定为碰撞。
  - WHEN 发生碰撞，THEN 立即冻结所有物理模拟，触发死亡状态。

## 2. 状态与数据结构 (State & Data Structures)

- **GameState**：
  - `distance`: Float, 记录当前滑行总距离（米）。
  - `score`: Integer, 等同于 `floor(distance)`。
  - `status`: Enum { `IDLE`, `PLAYING`, `GAMEOVER` }。
- **Entity: Player**：
  - `pos`: Vector2 (x, y)。
  - `vel`: Vector2 (vx, vy)。
  - `ribbons`: Array<Vector2>, 存储过去 $N$ 帧的位置用于渲染平滑拖尾。
  - `angle`: Float, 随 $V_y$ 动态调整的旋转弧度。
- **Environment**：
  - `colorStage`: Integer, 当前背景色相阶段。
  - `transitionFactor`: Float [0..1], 渐变插值权重。
  - `terrainNodes`: Queue<Vector2>, 存储视口内及预加载的地形采样点。
  - `obstacles`: Array<Entity>, 存储当前活跃的障碍物对象。

## 3. 渲染流程 (Rendering Pipeline)

- **画布配置**：
  - Context SHALL 设置为 `2d`。
  - Canvas 尺寸 SHALL 强制锁定 12:8 比例，根据窗口动态 `scale` 适应屏幕，但保持逻辑分辨率一致。
- **渲染层级 (Z-Order)**：
  1. **Background**: 线性渐变填充。
  2. **Decorations (Water)**: 半透明黑色剪影。
  3. **Terrain**: 纯黑 (#000000) 填充路径。
  4. **Obstacles**: 纯黑 (#000000) 填充。
  5. **Player Ribbon**: 渐变或半透明描边。
  6. **Player core**: 金属质感（使用 `createRadialGradient` 实现）。
  7. **VFX**: 粒子系统（点阵）。
- **色彩切换逻辑**：
  - WHEN `distance % 12000` 跨度发生时，THEN 启动背景色插值计算。
  - `ctx.fillStyle` SHALL 使用 `rgba` 或 `hsla` 计算两个阶段色彩的中间值，确保画面无跳变。

## 4. 程序生成规则 (Procedural Generation Rules)

- **地形生成 (Perlin/Simplex Noise)**：
  - 地形高度 $H$ SHALL 由多频率噪声叠合产生：$H = noise(x \cdot f_1) \cdot A_1 + noise(x \cdot f_2) \cdot A_2$。
  - WHEN `distance` 增加，THEN $f$ (频率) 与 $A$ (振幅) 线性增加以提升崎岖度。
  - 地形采样点间距 SHALL 固定为 10px，渲染时使用 `bezierCurveTo` 平滑连接。
- **障碍物生成规则**：
  - 间隔区间 $D_{gap} = Random(min, max)$，随距离线性减小。
  - WHEN 生成新障碍物，THEN 检查其 $Y$ 坐标：
    - SHALL 保留角色纵向位置上下 20% 的安全区域。
    - SHALL 距离地形边缘至少 50px。
    - SHALL 距离最近的树木（装饰）至少 100px。
- **前景水体**：
  - 水体 SHALL 建立在地形凹陷处（局部 $H$ 的极小值点）。
  - WHEN 地形 $H$ 低于特定海平面基准，THEN 该区域生成填充水色。

## 5. 性能与体验约束 (Performance & Experience Constraints)

- **帧率控制**：
  - 引擎 SHALL 使用 `requestAnimationFrame`。
  - 逻辑更新与渲染更新 SHALL 分离，使用固定步长（Fixed Timestep）模拟物理，避免帧率波动导致的穿模。
- **内存管理**：
  - 移出左边界的 `terrainNodes` 与 `obstacles` SHALL 立即被从内存中销毁或放入对象池回收。
  - Ribbon 数组长度 SHALL 严格限制在 50 点以内。
- **自适应渲染**：
  - WHEN 为移动端触发，THEN 下调粒子最大并发数量上限至 100。

## 6. 边界与异常处理 (Boundary & Exception Handling)

- **视口溢出**：
  - WHEN 角色上升超过上边界，THEN 强制锁定 $Y$ 坐标于 $0 + margin$，并保持速度向上（产生碰撞墙感）。
  - WHEN 角色掉落至下边界（如果地形缺失），THEN 判定为游戏结束。
- **资源容错**：
  - 游戏 SHALL 不依赖外部图片素材，所有视觉元素均由 Canvas API 动态绘制。
- **数值溢出**：
  - `distance` 达到 `Number.MAX_SAFE_INTEGER` 时（理论不可达），游戏 SHALL 自动归零或循环。

## 7. 动画细节规格 (Animation Specs)

- **披风 (Cloth Simulation)**：
  - 披风由 5-8 个挂节点组成。
  - 节点位置满足约束：$dist(P_i, P_{i-1}) = const$。
  - WHEN 速度增加，THEN 增加水平方向的随机抖动频率及振幅。
- **金属感实现**：
  - 角色球体 SHALL 使用 3 层径向渐变，高光位置设在左上角 (25%, 25%)。
