import {freezer, isMINTResponseFailure, deepCopy} from "../app/utils";
import {mockError} from "./mocks";

describe("utils", () => {
    it("deep freezes an object", () => {

        const data = {
            nothing: null,
            time: 10,
            name: "hello",
            items: [1, null, "three", {label: "l1"}],
            child: {
                name: "child",
                items: [4, null, "five"]
            }
        };

        const frozen = freezer.deepFreeze({...data});
        expect(frozen).toStrictEqual(data);
        expect(Object.isFrozen(frozen)).toBe(true);
        expect(Object.isFrozen(frozen.items)).toBe(true);
        expect(Object.isFrozen(frozen.child)).toBe(true);
        expect(Object.isFrozen(frozen.child.items)).toBe(true);
    });

    it("deep freezes an array", () => {

        const data = [{id: 1}, {child: {id: 2}}, 1, "hi"];

        const frozen = freezer.deepFreeze([...data]);
        expect(frozen).toStrictEqual(data);
        expect(Object.isFrozen(frozen[0])).toBe(true);
        expect(Object.isFrozen(frozen[1].child)).toBe(true);
    });

    describe("isMINTResponseFailure", () => {

        it("is false  if errors are missing", () => {
            const test = {
                status: "failure"
            }

            expect(isMINTResponseFailure(test)).toBe(false);
        });

        it("is false  if errors are not an array", () => {
            const test = {
                errors: {},
                status: "failure"
            }

            expect(isMINTResponseFailure(test)).toBe(false);
        });

        it("is false  if error items are not in correct format", () => {
            const test = {
                errors: ["message"],
                status: "failure"
            }

            expect(isMINTResponseFailure(test)).toBe(false);
        });

        it("is false if status is not failure", () => {
            const test = {
                errors: [],
                status: "success"
            }

            expect(isMINTResponseFailure(test)).toBe(false);
        });

        it("is true if status is failure and errors are a valid array", () => {
            const testEmpty = {
                errors: [],
                status: "failure"
            }

            const test = {
                errors: [mockError("some message")],
                status: "failure"
            }

            expect(isMINTResponseFailure(testEmpty)).toBe(true);
            expect(isMINTResponseFailure(test)).toBe(true);
        });

    });

    it("deep copies an object", () => {

        const data = {
            nothing: null,
            truth: true,
            time: 10,
            name: "hello",
            untrue: false,
            zero: 0,
            empty: "",
            items: [1, null, "three", {label: "l1"}, 0, false, ""],
            child: {
                name: "child",
                items: [4, null, "five"]
            }
        };

        const copy = deepCopy(data);
        expect(JSON.stringify(copy)).toEqual(JSON.stringify(data));
        expect(copy.items).not.toBe(data.items);
        expect(copy.items[3]).not.toBe(data.items[3]);
        expect(copy.child).not.toBe(data.child);
        expect(copy.child.items).not.toBe(data.child.items);
    });

});
