import {mutations, RootMutation} from "../../app/mutations";
import {mockRootState} from "../mocks";

describe("mutations", () => {

    it("adds a new project", () => {
        const state = mockRootState()
        mutations[RootMutation.AddProject](state, {
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        });
        expect(state.currentProject).toStrictEqual({
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        })
    });

});
