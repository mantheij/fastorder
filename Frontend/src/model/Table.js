// Table.js
export default class Table {
    constructor(id, area, occupied, width, height) {
        this.id = id;
        this.area = area;
        this.occupied = occupied;
        this.width = (width / 768 * 100) + 'vw';
        this.height = (height / 1024 * 100) + 'vh';
    }

    getColor() {
        return this.occupied ? "#EA6E6E" : "#DCEDFB";
    }

}
