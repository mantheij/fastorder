// Table.js
export default class Table {
    constructor(id, area, occupied, width, height) {
        this.id = id;
        this.area = area;
        this.occupied = occupied;
        this.width = width;
        this.height = height;
    }

    getColor() {
        return this.occupied ? "#EA6E6E" : "#DCEDFB";
    }

}
