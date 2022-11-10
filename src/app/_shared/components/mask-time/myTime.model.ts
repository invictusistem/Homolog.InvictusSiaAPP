export class MyTime {
    constructor(
        public hora: string,
        public minuto: string
        
    ) { }

    customTime() {
        var time: string = `${this.hora}:${this.minuto}`;
        return time
    }
}