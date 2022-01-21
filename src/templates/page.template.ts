import { upperCaseFirst } from "upper-case-first";

export const getPageTemplate = (fileName: string): string => {

    const arr = fileName.split("_");
    const className = arr.map(e => upperCaseFirst(e)).reduce((pre, next) => {
        return pre + next;
    }, '');

    return `import '../bloc/bloc.dart';
import '${fileName}_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
    
class ${className}Page extends StatelessWidget {
  const ${className}Page({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ${className}Bloc(Default${className}State()),
      child: _buildBody(),
    );
  }
    
  Widget _buildBody() {
    return BlocListener(
      listener: (context, state) {},
      child: ${className}View(),
    );
  }
}`;
}
