Array.prototype.groupBy = function (count: number) {
    const subArrays = [];
    for (let i = 0; i < this.length; i += 3) {
        subArrays.push((this as Array<any>).slice(i, i + 3));
    }
    return subArrays;
};