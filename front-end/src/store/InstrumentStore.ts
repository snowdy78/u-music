import { types, Instance } from "mobx-state-tree";
import { Instrument, IInstrument } from "./Instrument";
import { DataBaseInstrumentInstance } from "../server-api";

export const InstrumentStore = 
    types.model('InstrumentStore', {
        instruments: types.array(Instrument),
    })
    .views(self => ({
        findById(id: number) {
            return self.instruments.find(instrument => instrument.id === id);
        },
        get(index: number) {
            return self.instruments[index];
        },
    }))
    .actions(self => ({
        insert(instrument: DataBaseInstrumentInstance) {
            self.instruments.push(Instrument.create(instrument));
        },
        erase(id: number) {
            self.instruments.splice(id, 1);
        },
        map<T>(callback: (instrument: IInstrument, index: number) => T) {
            return self.instruments.map(callback);
        },
        forEach(callback: (instrument: IInstrument, index: number) => void) {
            self.instruments.forEach(callback);
        },
    }));

export interface IInstrumentStore extends Instance<typeof InstrumentStore> {}
