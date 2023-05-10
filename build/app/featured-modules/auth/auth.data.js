"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveUsers = void 0;
class ActiveUsers {
}
exports.ActiveUsers = ActiveUsers;
_a = ActiveUsers;
ActiveUsers.loginUseres = [];
ActiveUsers.add = (token) => _a.loginUseres.push(token);
ActiveUsers.find = (token) => _a.loginUseres.includes(token);
ActiveUsers.remove = (token) => {
    if (_a.find(token)) {
        const index = _a.loginUseres.findIndex(t => t === token);
        _a.loginUseres.splice(index, 1);
        return true;
    }
    else
        return false;
};
