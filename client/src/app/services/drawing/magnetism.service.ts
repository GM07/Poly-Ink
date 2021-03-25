import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';

@Injectable({
  providedIn: 'root'
})
export class MagnetismService {
  magnetismShortcut: ShortcutKey;

  constructor() {
    this.magnetismShortcut = new ShortcutKey('m');
  }
}
