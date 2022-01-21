import { InputBoxOptions, workspace, window } from "vscode";
import * as _ from "lodash";
import { existsSync, writeFile } from "fs";
import * as mkdirp from 'mkdirp';
import { getEventTemplate, getStateTemplate, getBlocTemplate, getPageTemplate, getViewTemplate, getRouterTemplate } from "../templates";


export const newPage = async () => {

    const pageName = await promptForPageName();
    if (_.isNil(pageName) || pageName.trim() === "") {
        window.showErrorMessage("The page name must not be empty");
        return;
    }

    let targetDirectory = promptForTargetDirectory();
    if (_.isNil(targetDirectory)) {
        window.showErrorMessage("Please select a valid directory");
        return;
    }

    try {
        await generateBlocCode(pageName, targetDirectory);
    } catch (error) {
        window.showErrorMessage(
            `Error:
            ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
}

function promptForPageName(): Thenable<string | undefined> {
    const pageNamePromptOptions: InputBoxOptions = {
        prompt: "Page Name",
        placeHolder: "home",
    };
    return window.showInputBox(pageNamePromptOptions);
}

function promptForTargetDirectory(): string | undefined {
    if (workspace.workspaceFolders !== undefined) {
        return workspace.workspaceFolders[0].uri.path + `/lib/pages/`;
    }
    return undefined;
}

async function generateBlocCode(name: string, targetDirectory: string) {

    const folder = `${targetDirectory}/${name}`;
    if (!existsSync(folder)) {
        await createDirectory(folder);
    }

    await createFile(`${folder}/index.dart`, `export '${name}_router.dart';`);
    await createFile(`${folder}/${name}_router.dart`, getRouterTemplate(name));

    await createBlocTemplate(name, folder);
    await createViewsTemplate(name, folder);
}

async function createBlocTemplate(name: string, targetDirectory: string) {

    const blocDirectoryPath = `${targetDirectory}/bloc`;
    if (!existsSync(blocDirectoryPath)) {
        await createDirectory(blocDirectoryPath);
    }

    const stateFilePath = `${blocDirectoryPath}/${name}_state.dart`;
    await createFile(stateFilePath, getStateTemplate(name));

    const eventFilePath = `${blocDirectoryPath}/${name}_event.dart`;
    await createFile(eventFilePath, getEventTemplate(name));

    const blocFilePath = `${blocDirectoryPath}/${name}_bloc.dart`;
    await createFile(blocFilePath, getBlocTemplate(name));

    const indexFilePath = `${targetDirectory}/bloc/bloc.dart`;
    await createFile(indexFilePath,
        `export '${name}_state.dart';
export '${name}_event.dart';
export '${name}_bloc.dart';
    `);
}

async function createViewsTemplate(name: string, targetDirectory: string) {

    const directoryPath = `${targetDirectory}/views`;
    if (!existsSync(directoryPath)) {
        await createDirectory(directoryPath);
    }

    const pageFilePath = `${directoryPath}/${name}_page.dart`;
    await createFile(pageFilePath, getPageTemplate(name));

    const viewFilePath = `${directoryPath}/${name}_view.dart`;
    await createFile(viewFilePath, getViewTemplate(name));
}

function createFile(targetPath: string, content: string) {
    if (existsSync(targetPath)) {
        throw Error(`${targetPath} already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(targetPath, content, "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

function createDirectory(targetDirectory: string): Promise<void> {
    return new Promise((resolve, reject) => {
        mkdirp(targetDirectory)
            .then(() => resolve())
            .catch(e => reject(e));
    });
}