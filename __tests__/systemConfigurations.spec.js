import { describe } from "node:test";

describe("Test Login Button", () => {
    test("it should be disabled if the value of the Doc ID or Auth Key is null or empty", () => {
        const input = [
            {id: 1, docID: null, authKey: null},
            {id: 2, docID: "valueinDocID", authKey: null},
            {id: 3, docID: null, authKey: "valueInAuthKey"},
            {id: 4, docID: "valueinDocID", authKey: "valueInAuthKey"},
        ];
    });
});