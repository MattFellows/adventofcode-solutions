

export const solveSimultaneous2 = ([[eq1Coefficient1, eq1Coefficient2, eq1Coefficient3], [eq2Coefficient1, eq2Coefficient2, eq2Coefficient3]]:number[][]):number[] => {
    return [
        (eq1Coefficient3*eq2Coefficient2 - eq2Coefficient3*eq1Coefficient2) / (eq1Coefficient1*eq2Coefficient2 - eq2Coefficient1*eq1Coefficient2), 
        (eq1Coefficient3*eq2Coefficient1 - eq2Coefficient3*eq1Coefficient1) / (eq2Coefficient1*eq1Coefficient2 - eq1Coefficient1*eq2Coefficient2)
    ];
}