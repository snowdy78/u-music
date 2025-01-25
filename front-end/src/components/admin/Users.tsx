import React from "react";
import { ContentComponentProps } from "./Admin";
import { DataBaseUserInstance, ServerApi } from "../../server-api";
import { useStore } from "../../store/hooks/useStore";

export function UsersRouting({name, header, ...props}: ContentComponentProps): React.JSX.Element {
    const store = useStore(); 
    const [error, setError] = React.useState<string>('');
    const [users, setUsers] = React.useState<DataBaseUserInstance[]>([]);
    React.useEffect(() => {
        ServerApi.getUsers().then(setUsers);
    }, []);
    function deleteUser(id: number) {
        console.log({...store.authorized_user}, id);
        if (store.authorized_user === null || id === +store.authorized_user.id) {
            setError('You cannot delete yourself');
            setTimeout(async () => {
                setError('');
            }, 2000);
            return;
        }
        ServerApi.deleteUser(id).then(() => {
            const user = users.findIndex((user: DataBaseUserInstance) => user.id === id);
            if (user) {
                users.splice(user, 1);
                setUsers([...users]);
            }
        });
    }
    function editUser(id: number) {
        window.location.href = `admin/user-edit/${id}`;
    }
    return (
        <div className='container'>
            <div className='fail-field' style={error ? {opacity: 1} : undefined}>{error}</div>
            <h3
                {...props}
            >
                {header}
            </h3>
            <div className='container admin__users'>
                <div className='admin__users-row'>
                    <div>
                        ID
                    </div>
                    <div>
                        Login
                    </div>
                    <div>
                        Email
                    </div>
                    <div>
                        Password
                    </div>
                    <div>
                        Role
                    </div>
                    <div>
                        Avatar
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                </div>
                {
                    users.map((user: DataBaseUserInstance) => {
                        return (
                            <div key={user.id} className='admin__users-row'>
                                <div>
                                    {user.id}
                                </div>
                                <div>
                                    {user.login}
                                </div>
                                <div>
                                    {user.email}
                                </div>
                                <div>
                                    {user.password}
                                </div>
                                <div>
                                    {+user.is_admin === 1 ? 'Admin' : 'User'}
                                </div>
                                <div>
                                    {user.img_id ? 'Has' : 'No'}
                                </div>
                                <button className='btn' onClick={() => editUser(+user.id)}>
                                    <img className='icon edit-icon' src="/src/assets/icons/edit-white.svg" alt="" />
                                </button>
                                <button className='btn' onClick={() => deleteUser(+user.id)}>
                                    <img className='icon trash-icon' src="/src/assets/icons/trash-white.svg" alt="" />
                                </button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
