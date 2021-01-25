import {getErrorInterval} from "../../../app/components/figures/errorInterval";

describe("error intervals", () => {

    it("correctly calculates interval", () => {
        expect(getErrorInterval(2, 3, 6)).toEqual({plus: 3, minus: 1});
    });

    it("correctly expands interval to include mean", () => {
        expect(getErrorInterval(2, 6, 3)).toEqual({plus: 0, minus: 4});
        expect(getErrorInterval(2, 1, 6)).toEqual({plus: 5, minus: 0});
    });

});
