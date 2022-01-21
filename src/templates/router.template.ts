import { upperCaseFirst } from "upper-case-first";

export const getRouterTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');

    return `import 'views/${fileName}_page.dart';
import 'package:flutter/material.dart';
    
class ${className}Router {
    static String kName = "${className}Page";
    
    MaterialPageRoute get route {
        final settings = RouteSettings(name: kName, arguments: Map());
        return MaterialPageRoute(builder: (context) => ${className}Page(), settings: settings);
    }
}
`;
}
