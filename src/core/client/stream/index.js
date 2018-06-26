var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import ReactDOM from "react-dom";
import { createContext, TalkContextProvider, } from "talk-framework/lib/bootstrap";
import { initLocalState } from "./local";
import localesData from "./locales";
import AppQuery from "./queries/AppQuery";
// This is called when the context is first initialized.
function init({ relayEnvironment }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initLocalState(relayEnvironment);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Bootstrap our context.
        const context = yield createContext({
            init,
            localesData,
            userLocales: navigator.languages,
        });
        const Index = () => (React.createElement(TalkContextProvider, { value: context },
            React.createElement(AppQuery, null)));
        ReactDOM.render(React.createElement(Index, null), document.getElementById("app"));
    });
}
main();
