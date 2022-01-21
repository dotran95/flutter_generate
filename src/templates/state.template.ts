import { upperCaseFirst } from "upper-case-first";

export const getStateTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');
    return `abstract class ${className}State {}

class Default${className}State extends ${className}State {}
`;
}



