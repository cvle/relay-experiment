"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGeneratedModule = function (_a) {
    var moduleName = _a.moduleName, documentType = _a.documentType, docText = _a.docText, concreteText = _a.concreteText, typeText = _a.typeText, hash = _a.hash, relayRuntimeModule = _a.relayRuntimeModule, sourceHash = _a.sourceHash;
    var documentTypeImport = documentType
        ? "import { " + documentType + " } from \"" + relayRuntimeModule + "\";"
        : "";
    var docTextComment = docText ? "\n/*\n" + docText.trim() + "\n*/\n" : "";

    // TODO: (@cvle) Hack to allow --noImplicitAny
    // See https://github.com/relay-tools/relay-compiler-language-typescript/issues/48
    concreteText = concreteText.replace(/ null,/g, " null as any,");
    concreteText = concreteText.replace(/ null$/gm, " null as any");

    return "/* tslint:disable */\n\n" + documentTypeImport + "\n" + (typeText || "") + "\n\n" + docTextComment + "\nconst node: " + (documentType || "never") + " = " + concreteText + ";\n(node as any).hash = '" + sourceHash + "';\nexport default node;\n";
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0R2VuZXJhdGVkTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Zvcm1hdEdlbmVyYXRlZE1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVhLFFBQUEscUJBQXFCLEdBQWlCLFVBQUMsRUFTbkQ7UUFSQywwQkFBVSxFQUNWLDhCQUFZLEVBQ1osb0JBQU8sRUFDUCw4QkFBWSxFQUNaLHNCQUFRLEVBQ1IsY0FBSSxFQUNKLDBDQUFrQixFQUNsQiwwQkFBVTtJQUVWLElBQU0sa0JBQWtCLEdBQUcsWUFBWTtRQUNyQyxDQUFDLENBQUMsY0FBWSxZQUFZLGtCQUFZLGtCQUFrQixRQUFJO1FBQzVELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDUCxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDM0UsTUFBTSxDQUFDLDZCQUVQLGtCQUFrQixXQUNsQixRQUFRLElBQUksRUFBRSxhQUVkLGNBQWMsdUJBQ0YsWUFBWSxJQUFJLE9BQU8sWUFBTSxZQUFZLGlDQUMvQixVQUFVLCtCQUVqQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDIn0=
