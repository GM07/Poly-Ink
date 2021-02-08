// Order matters here
// Tool icons at the bottom of the side bar
import { ExportSettings } from './export-settings';
import { SaveSettings } from './save-settings';
import { ToolSettings } from './tool-settings';

export const BOTTOM_TOOLS: ToolSettings[] = [new SaveSettings(), new ExportSettings()];
