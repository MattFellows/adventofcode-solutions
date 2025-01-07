export const generatePermutations = (str:string):string[] => {
    const permutations:string[] = [];
    const permute = (str: string, left: number, right: number) => {
        if (left == right) {
            permutations.push(str);
        } else {
            for (let i = left; i <= right; i++) {
                str = swap(str, left, i);
                permute(str, left + 1, right);
                str = swap(str, left, i);
            }
        }
    }
    const swap = (a: string, i: number, j: number) => {
        const charArray = a.split("");
        const temp = charArray[i];
        charArray[i] = charArray[j];
        charArray[j] = temp;
        return charArray.join("");
    }
    permute(str, 0, str.length - 1);
    return permutations;
}

export const deferred = () => {
    let resolve, reject
    const promise = new Promise((res,rej) => {
        resolve = res
        reject = rej
    })
    return { promise, resolve, reject }
}

export const sleep = (ms: number) => {
    // console.log('Sleep', ms)
    return new Promise(resolve => setTimeout(() => {resolve(1)}, ms));
}