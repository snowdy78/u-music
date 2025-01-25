import { types, Instance } from "mobx-state-tree";
import { Instrument, IInstrument } from "./Instrument";
import { DataBaseInstrumentInstance } from "../server-api";

export const InstrumentStore = 
    types.model('InstrumentStore', {
        instruments: types.array(Instrument),
    })
    .views(self => ({
        length() {
            return self.instruments.length;
        },
        findById(id: number) {
            return self.instruments.find(instrument => instrument.id === id);
        },
        get(index: number) {
            return self.instruments[index];
        },
        getArray(): IInstrument[] {
            return self.instruments;
        },
    }))
    .actions(self => ({
        clear() {
            self.instruments.clear();
        },
        insert(instrument: DataBaseInstrumentInstance) {
            self.instruments.push(Instrument.create({...instrument, img_data: null}));
        },
        eraseById(id: number) {
            self.instruments.splice(self.instruments.findIndex(instrument => instrument.id === id), 1);
        },
        erase(index: number) {
            self.instruments.splice(index, 1);
        },
        map<T>(callback: (instrument: IInstrument, index: number) => T) {
            return self.instruments.map(callback);
        },
        forEach(callback: (instrument: IInstrument, index: number) => void) {
            self.instruments.forEach(callback);
        },
    }));

export interface IInstrumentStore extends Instance<typeof InstrumentStore> {}
