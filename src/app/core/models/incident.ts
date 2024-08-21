export class IncidentItem {
    public readonly id: number;
    public readonly recordingId: number;
    public readonly detectionInstanceId: number;
    public readonly plantId: number;
    public readonly timestamp: Date;
    public readonly className: string;

    constructor(
        id: number,
        recordingId: number,
        detectionInstanceId: number,
        plantId: number,
        timestamp: Date,
        className: string
    ) {
        if (!(timestamp instanceof Date)) {
            throw new Error('timestamp must be a Date object');
        }
        
        this.id = id;
        this.recordingId = recordingId;
        this.detectionInstanceId = detectionInstanceId;
        this.plantId = plantId;
        this.timestamp = timestamp;
        this.className = className;
    }
}
