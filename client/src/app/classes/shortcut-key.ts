export class ShortcutKey {
    constructor(public key: string, public ctrlKey: boolean = false, public shiftKey: boolean = false, public altKey: boolean = false) {}

    equals(event: KeyboardEvent): boolean {
        let equals = true;
        equals = equals && this.ctrlKey === event.ctrlKey;
        equals = equals && this.shiftKey === event.shiftKey;
        equals = equals && this.altKey === event.altKey;
        return equals && this.key === event.key.toLocaleLowerCase();
    }
}
