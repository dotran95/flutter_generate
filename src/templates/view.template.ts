import { upperCaseFirst } from "upper-case-first";

export const getViewTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');

    return `
import 'package:flutter/material.dart';
import '../../../widgets/index.dart';

class ${className}View extends StatelessWidget {
    const ${className}View({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        return Layout(
            child: Center(
          child: Text("${className}"),
        ));
    }
}
`;
}
