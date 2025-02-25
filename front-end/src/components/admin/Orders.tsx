import React from "react";
import { ContentComponentProps } from "./Admin";
import { DataBaseOrderInstance, ServerApi } from "../../server-api";

export function OrdersRouting({header, name, ...props}: ContentComponentProps) {
    const [error, _] = React.useState<string>('');
    const [orders, setOrders] = React.useState<DataBaseOrderInstance[]>([]);
    React.useEffect(() => {
        ServerApi.getOrders().then(setOrders);
    }, []);
    async function deleteOrder(id: number) {
        if (!orders) 
            return;
        await ServerApi.deleteOrder(id);
        const index = orders.findIndex(order => order.id === id);
        if (index !== -1) {
            orders.splice(index, 1);
            setOrders({...orders});
        }
    }
    return (
        <div className='container'>
            <h3
                {...props}
            >
                {error ? <p className='fail-field'>error</p> : header}
            </h3>
            <div className='container admin__orders'>
                <div className='admin__orders-row'>
                    <div>
                        ID
                    </div>
                    <div>
                        User_id
                    </div>
                    <div>
                        Goods
                    </div>
                </div>
                {
                    orders ? orders.map((order: DataBaseOrderInstance) => {
                        return (
                            <div key={'order:' + order.id} className='admin__orders-row'>
                                <div>
                                    {order.id}
                                </div>
                                <div>
                                    {order.user_id}
                                </div>
                                <div className='orders__goods'>
                                    <div className='orders__goods__good'>
                                        <div className='good__id'>ID</div>
                                        <div className='good__count'>Count</div>
                                    </div>
                                    {
                                        order.goods.map((good) => {
                                            return (
                                                <div key={'good:' + good.id} className='orders__goods__good'>
                                                    <div className='good__id'>{good.id}</div>
                                                    <div className='good__count'>{good.count}</div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <button className='btn' onClick={async () => deleteOrder(+order.id)}>
                                    <img className='icon trash-icon' src="/src/assets/icons/trash-white.svg" alt="" />
                                </button>
                            </div>
                        );
                    }) : null
                }
            </div>
        </div>

    );
}

