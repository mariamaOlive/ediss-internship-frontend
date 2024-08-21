export class CameraItem {
    public readonly name: string;
    public readonly id: number;
    public readonly ipAddress: string;

    constructor(name: string, id: number, ipAddress: string) {
        this.name = name;
        this.id = id;
        this.ipAddress = ipAddress;
    }
}
