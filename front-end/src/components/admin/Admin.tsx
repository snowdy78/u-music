import { AdministratedPage } from "../AdministratedPage";
import React from "react";
import { Instruments } from "./Instruments";
import { UsersRouting } from "./Users";
import { OrdersRouting } from "./Orders";
import { observer } from "mobx-react-lite";
export type ContentComponentProps = {
    name: string;
    header: string;
} & React.HTMLProps<HTMLDivElement>;
export type ContentComponentElement = HTMLDivElement;

export type Route = ContentComponentElement | null;
export type RoutingContentComponent = (props: ContentComponentProps) => React.JSX.Element;
export type RouteObject = {
    props: ContentComponentProps;
    ref: React.MutableRefObject<Route>;
    ContentComponent: RoutingContentComponent;
}

export function Admin() {
    const routes: RouteObject[] = [
        {
            props: {
                name: 'instruments',
                header: 'Инструменты',
            },
            ref: React.useRef<Route>(null),
            ContentComponent: observer(Instruments),
        },
        {
            props: {
                name: 'users',
                header: 'Пользователи',
            },
            ref: React.useRef<Route>(null),
            ContentComponent: observer(UsersRouting),
        },
        {
            props: {
                name: 'orders',
                header: 'Заказы',
            },
            ref: React.useRef<Route>(null),
            ContentComponent: observer(OrdersRouting),
        },
    ];
    type Router = {
        current: RouteObject;
        beforeRedirection: (this: Router) => void;
        afterRedirection: (this: Router) => void;
    };
    function reducer(state: Router, action: RouteObject) {
        state.beforeRedirection();
        state.current = action;
        state.afterRedirection();
        state = {...state};
        return state;
    }
    const [route, redirect] = React.useReducer(reducer, {
        current: routes[0],
        beforeRedirection(this: Router) {
            if (this.current.ref.current !== null) {
                this.current.ref.current.classList.remove('active');
            }
        },
        afterRedirection(this: Router) {
            if (this.current.ref.current !== null) {
                this.current.ref.current.classList.add('active');
            }
        },
    });
    React.useEffect(() => {
        if (route.current !== null) {
            route.afterRedirection();
        };
    }, [route]);
    return (
        <AdministratedPage>
            <div className='admin'>
                <h2>Администрирование</h2>
                <div className='admin-routing'>
                    {
                        routes.map((route, key) => {
                            return (
                            <div 
                                    key={`header:${route.props.name}` + key}
                                    ref={route.ref} 
                                    className={`admin-routing__${route.props.name} route`}
                                    onClick={() => redirect(route)}
                            >
                                {route.props.header}
                            </div>
                            );
                        })
                    }
                </div>
                <route.current.ContentComponent {...route.current.props} />
            </div>
        </AdministratedPage>
    );
}