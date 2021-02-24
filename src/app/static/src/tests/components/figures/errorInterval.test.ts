import {getErrorInterval} from "../../../app/components/figures/errorInterval";

describe("error intervals", () => {

    it("correctly calculates interval", () => {
        expect(getErrorInterval(2, 3, 6)).toEqual({plus: 3, minus: 1});
    });

});
