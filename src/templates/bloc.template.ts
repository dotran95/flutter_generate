import { upperCaseFirst } from "upper-case-first";

export const getBlocTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');

    return `import '${fileName}_event.dart';
import '${fileName}_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ${className}Bloc extends Bloc<${className}Event, ${className}State> {
    ${className}Bloc(${className}State initialState) : super(initialState);
}`;
}
