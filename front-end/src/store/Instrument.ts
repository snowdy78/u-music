import {flow, Instance, types} from 'mobx-state-tree';
import { ServerApi } from "../server-api";

export enum EInstrumentCategory {
    Guitar = 'Guitar',
    Bass = 'Bass',
    Drums = 'Drums',
    Piano = 'Piano',
    Ukulele = 'Ukulele',
    Synth = 'Synth',
    Trumpet = 'Trumpet',
}

export const InstrumentCategory = types.enumeration(
    'InstrumentCategory',
    [
        EInstrumentCategory.Guitar, 
        EInstrumentCategory.Bass,
        EInstrumentCategory.Drums,
        EInstrumentCategory.Piano,
        EInstrumentCategory.Ukulele,
        EInstrumentCategory.Synth, 
        EInstrumentCategory.Trumpet
    ],
);

export const Instrument = types.model('Instrument', {
  id: types.number,
  model_name: types.string,
  category: InstrumentCategory,
  price: types.number,
  in_stock: types.number,
  img_id: types.maybeNull(types.number),
  img_data: types.maybeNull(types.string),
}).views(self => ({
    noImgData() {
        return self.img_data === null;
    },
    hasImg() {
        return self.img_id !== null;
    }

})).actions(self => ({
    loadImgData: flow(function *() {
        if (!self.hasImg()) {
            throw new Error('Instrument has no image');
        }
        try {
            const image = yield ServerApi.getImage(self.img_id!);
            self.img_data = image.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }),
}));

export interface IInstrument extends Instance<typeof Instrument> {}

