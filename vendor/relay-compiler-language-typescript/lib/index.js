"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatGeneratedModule_1 = require("./formatGeneratedModule");
var FindGraphQLTags_1 = require("./FindGraphQLTags");
var TypeScriptGenerator = require("./TypeScriptGenerator");
function plugin() {
    return {
        inputExtensions: ["ts", "tsx"],
        outputExtension: "ts",
        findGraphQLTags: FindGraphQLTags_1.find,
        formatModule: formatGeneratedModule_1.formatGeneratedModule,
        typeGenerator: TypeScriptGenerator
    };
}
exports.default = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpRUFBZ0U7QUFDaEUscURBQXlDO0FBQ3pDLDJEQUE2RDtBQUU3RDtJQUNFLE1BQU0sQ0FBQztRQUNMLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDOUIsZUFBZSxFQUFFLElBQUk7UUFDckIsZUFBZSxFQUFFLHNCQUFJO1FBQ3JCLFlBQVksRUFBRSw2Q0FBcUI7UUFDbkMsYUFBYSxFQUFFLG1CQUFtQjtLQUNuQyxDQUFDO0FBQ0osQ0FBQztBQVJELHlCQVFDIn0=