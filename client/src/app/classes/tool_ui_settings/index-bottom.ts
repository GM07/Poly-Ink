// Tool icons at the bottom of the side bar
import { ExportSettings } from './export-settings';
import { NewDrawing } from './new-drawing-settings';
import { Redo } from './redo-settings';
import { SaveSettings } from './save-settings';
import { ToolSettings } from './tool-settings';
import { Undo } from './undo-settings';

export const BOTTOM_TOOLS: ToolSettings[] = [new Undo(), new Redo(), new NewDrawing(), new ExportSettings(), new SaveSettings()];
