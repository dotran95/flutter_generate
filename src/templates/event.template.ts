import { upperCaseFirst } from "upper-case-first";

export const getEventTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');
    return `abstract class ${className}Event {}

class Default${className}Event extends ${className}Event {}
`;
}



