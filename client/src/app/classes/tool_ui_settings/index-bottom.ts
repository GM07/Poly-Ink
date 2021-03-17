// Order matters here
// Tool icons at the bottom of the side bar
import { ExportSettings } from './export-settings';
import { NewDrawing } from './new-drawing-settings';
import { SaveSettings } from './save-settings';
import { ToolSettings } from './tool-settings';

export const BOTTOM_TOOLS: ToolSettings[] = [new NewDrawing(), new ExportSettings(), new SaveSettings()];
