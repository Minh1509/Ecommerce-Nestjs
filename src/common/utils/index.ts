import * as _ from "lodash";

export const getInfoData = ({field= [], object = {}}) => {
    return _.pick(object, field);
}