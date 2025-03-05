/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { CardText, InputGroup, InputGroupText, Badge, Input } from 'reactstrap';
import userImg from '../assets/images/user.png';
import io from 'socket.io-client';
import { useReadMessageMutation } from '../redux/api/contactAPI';
import { getDateFormat } from '../utils/Utils';
import Avatar from './Avatar';
import { useAppSelector } from '../redux/store';

const socket = io('http://localhost:3005');

const ClientMessageSidebarLeft = ({ chats, setSelectedContact, setSelectedUser }) => {
    // ** Redux State
    const user = useAppSelector((state) => state.userState.user);

    // ** Local State
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const [filteredChat, setFilteredChat] = useState([]);

    const [readMessage] = useReadMessageMutation();

    // ** Handle User Click
    const handleUserClick = async (id, provider) => {
        socket.emit('joinRoom', id);
        setSelectedContact({ contactId: id });
        setSelectedUser({ provider });
        setActive(id);
        await readMessage({ contactId: id, data: provider._id });
    };

    // ** Filter Chats
    const handleFilter = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setQuery(searchValue);

        const filterFunction = (contact) => {
            const name = user.role === 'client' ? contact.provider.firstName : contact.client.firstName;
            return name.toLowerCase().includes(searchValue);
        };

        setFilteredChat(chats.filter(filterFunction));
    };

    // ** Render Chats
    const renderChats = () => {
        if (!chats || !chats.length) return null;

        const chatList = query.length ? filteredChat : chats;

        if (!chatList.length) {
            return (
                <li className="no-results show">
                    <h6 className="mb-0">No Chats Found</h6>
                </li>
            );
        }

        return chatList.map((item) => {
            const time = item.lastMessage ? item.lastMessage.createdAt : new Date();
            const name =
                user.role === 'client'
                    ? `${item.provider.firstName} ${item.provider.lastName}`
                    : `${item.client.firstName} ${item.client.lastName}`;
            const avatarImg =
                user.role === 'client' ? item.provider.avatar || userImg : item.client.avatar || userImg;

            return (
                <li
                    key={item._id}
                    onClick={() => handleUserClick(item._id, item.provider)}
                    className={classnames({ active: active === item._id })}>
                    <Avatar
                        img={avatarImg}
                        imgHeight="42"
                        imgWidth="42"
                        status={item.status}
                    />
                    <div className="chat-info flex-grow-1">
                        <h5 className="mb-0">{name}</h5>
                        <CardText className="text-truncate">{item.lastMessage?.content || ''}</CardText>
                    </div>
                    <div className="chat-meta text-nowrap">
                        <small className="float-end mb-25 chat-time ms-25">{getDateFormat(time)}</small>
                        {item.unreadCount > 0 && (
                            <Badge className="float-end" color="danger" pill>
                                {item.unreadCount}
                            </Badge>
                        )}
                    </div>
                </li>
            );
        });
    };

    return (
        <div className="sidebar-left">
            <div className="sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-close-icon">
                        <X size={14} />
                    </div>
                    <div className="chat-fixed-search">
                        <div className="d-flex align-items-center w-100">
                            <div className="sidebar-profile-toggle">
                                {user && Object.keys(user).length > 0 && (
                                    <Avatar
                                        className="avatar-border"
                                        img={user.avatar || userImg}
                                        imgHeight="42"
                                        imgWidth="42"
                                    />
                                )}
                            </div>
                            <InputGroup className="input-group-merge ms-1 w-100">
                                <InputGroupText className="round">
                                    <Search className="text-muted" size={14} />
                                </InputGroupText>
                                <Input
                                    value={query}
                                    className="round"
                                    placeholder="Search or start a new chat"
                                    onChange={handleFilter}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <PerfectScrollbar
                        className="chat-user-list-wrapper list-group"
                        options={{ wheelPropagation: false }}>
                        <h4 className="chat-list-title">Chats</h4>
                        <ul className="chat-users-list chat-list media-list">{renderChats()}</ul>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    );
};

export default ClientMessageSidebarLeft;
