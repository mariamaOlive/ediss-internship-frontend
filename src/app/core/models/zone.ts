export class ZoneItem {
    public readonly name: string;
    public readonly id: number;
    public readonly plantId: number;

    constructor(name: string, id: number, plantId: number) {
        this.name = name;
        this.id = id;
        this.plantId = plantId;
    }

}
