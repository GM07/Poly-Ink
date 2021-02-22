// Order matters here
// Tool icons at the top of the side bar
// export { AerosolSettings } from './aerosol-settings';

import { EllipseSelectionSettings } from './ellipse-selection-settings';
import { EllipseSettings } from './ellipse-settings';
import { EraserSettings } from './eraser-settings';
// import { EyeDropperSettings } from './eyedropper-settings';
// import { FillSettings } from './fill-settings';
// import { LassoSettings } from './lasso-settings';
import { LineSettings } from './line-settings';
import { PencilSettings } from './pencil-settings';
// import { PolygoneSettings } from './polygone-settings';
import { RectangleSelectionSettings } from './rectangle-selection-settings';
import { RectangleSettings } from './rectangle-settings';
import { ToolSettings } from './tool-settings';
// import { StampSettings } from './stamp-settings';
// import { TextSettings } from './text-settings';

export const TOP_TOOLS: ToolSettings[] = [
    new PencilSettings(),
    new LineSettings(),
    new RectangleSettings(),
    new EllipseSettings(),
    new EraserSettings(),
    new RectangleSelectionSettings(),
    new EllipseSelectionSettings(),
];
