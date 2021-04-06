/**
 * Generates a rotator around a packet
 * @param {Array} packet Array of data in any type
 * @returns rotator
 */
function rotator(packet) {
    return {
        i: 0,
        arr: packet,
        get(index) {
            return packet[index];
        },
        set(index, value) {
            return (packet[index] = value);
        },
        nex() {
            if (this.i === this.arr.length) {
                console.error(new Error('End reached'), this.arr)
                return -1;
            }
            return packet[this.i++];
        },
    };
}
Array.prototype.remove = function (index) {
    if (index === this.length - 1) return this.pop();
    this[index] = this.pop();
}

module.exports = rotator;