import React from 'react';
import { useStore } from '../../store/hooks/useStore';
import { ContentComponentProps } from "./Admin";
import { EInstrumentCategory, IInstrument } from "../../store/Instrument";
import { ServerApi } from "../../server-api";

export function arrayCategories() {
    const categories = [];
    for (let category in EInstrumentCategory) {
        categories.push({value: category});
    }
    return categories;
}


export function Instruments({name, header, ...props}: ContentComponentProps): React.JSX.Element {
    const store = useStore();
    
    const [instruments, setInstruments] = React.useState<IInstrument[] | null>(null);
    React.useEffect(() => {
        store.loadInstruments().then(async () => {
            setInstruments([...store.instruments.getArray()]);
        }).catch(rejection => console.error('instruments not loaded: ' + rejection.message));
    }, []);
    async function onInstrumentRemove(id: number) {
        await ServerApi.deleteInstrument(id);
        store.instruments.eraseById(id);
        if (!instruments) return;
        instruments.splice(instruments.findIndex((instrument) => instrument.id === id), 1);
        setInstruments([...instruments]);
    }
    function onInstrumentEdit(id: number) {
        window.location.href = `admin/instrument-edit/${id}`;
    }
    return (
        <div className='container admin-instruments'>
            <h3
                {...props}
            >
                {header}
            </h3>
            <div className='container admin-instruments__content'>
                <div className="container" style={{ textAlign: 'right' }}>
                    <button 
                        className='btn add-instrument'
                        onClick={() => window.location.href = `admin/instrument-add`}
                    >
                        +
                    </button>
                </div>
                <div className='instrument__row' style={{ borderBottom: '1px solid var(--black)'}}>
                    <div className='admin-instrument__field' >
                        ID
                    </div>
                    <div className='admin-instrument__field'>
                        Название
                    </div>
                    <div className='admin-instrument__field'>
                        Категория
                    </div>
                    <div className='admin-instrument__field'>
                        Цена
                    </div>
                    <div className='admin-instrument__field'>
                        В наличии
                    </div>
                    <div className='admin-instrument__field'>
                        Изображение
                    </div>
                    <div className='admin-instrument__field'>
                    </div>
                    <div className='admin-instrument__field'>
                    </div>
                </div>
                {
                    instruments !== null ? 
                        instruments.map((instrument, key) => {
                            let style = {};
                            const table_width = 8;
                            if (key === instruments.length - 1)
                                style = { ...style, borderBottom: '1px solid var(--black)' };
                            return (
                                <div className='instrument__row' key={'instrument:' + key}>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.id}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.model_name}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.category}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.price}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.in_stock}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        {instrument.img_id ?? '-'}
                                    </div>
                                    <div className='admin-instrument__field' style={style}>
                                        <button className='btn' title='Редактировать'
                                            onClick={() => onInstrumentEdit(instrument.id)}
                                        >
                                            <img className='icon edit-icon' src="/src/assets/icons/edit-white.svg" alt="" />
                                        </button>
                                    </div>
                                    <div className='admin-instrument__field' style={{...style, borderRight: '1px solid var(--black)'}}>
                                        <button className='btn' title='Удалить'
                                            onClick={() => onInstrumentRemove(instrument.id)}
                                        >
                                            <img className='icon trash-icon' src="/src/assets/icons/trash-white.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : null
                }
            </div>
        </div>
    );
};