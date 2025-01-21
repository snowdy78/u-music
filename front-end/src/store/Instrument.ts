import {Instance, types} from 'mobx-state-tree';

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
});

export interface IInstrument extends Instance<typeof Instrument> {}

