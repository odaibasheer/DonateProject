/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import classnames from "classnames";
import { X, Search } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { CardText, InputGroup, InputGroupText, Badge, Input } from "reactstrap";
import userImg from "../assets/images/user.png";
import io from "socket.io-client";
import { useCreateContactMutation, useReadMessageMutation } from "../redux/api/contactAPI";
import Avatar from "./Avatar";
import { useAppSelector } from "../redux/store";
import { formatDate } from "../utils/Utils";

const socket = io("http://localhost:3005");

const AdminMessageSidebarLeft = ({
    chats,
    setSelectedContact,
    setSelectedUser,
    contactUsers,
    filteredUsers,
    setFilteredUsers,
    refetch,
}) => {
    // ** Redux State
    const user = useAppSelector((state) => state.userState.user);

    // ** Local State
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const [readMessage] = useReadMessageMutation();
    const [createContact] = useCreateContactMutation();

    const handleUserClick = async (contact) => {
        try {
            const contactData = { client: contact._id };
            await createContact(contactData).unwrap();
            refetch();
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    // ** Handle Chat Click
    const handleChatClick = async (contactId, contact) => {
        socket.emit("joinRoom", contactId);
        setSelectedContact({ contactId });
        setSelectedUser({ client: contact });
        setActive(contactId);

        // Mark messages as read
        await readMessage({ contactId, data: contact._id });
    };

    // ** Filter Contacts
    const handleFilter = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setQuery(searchValue);
        if (contactUsers) {
            if (searchValue !== "") {
                const filtered = contactUsers.filter((user) => {
                    const name = `${user.username}`.toLowerCase();
                    return name.includes(searchValue);
                });
                setFilteredUsers(filtered);
            } else {
                setFilteredUsers([]);
            }

        }
    };

    // ** Render Chats
    const renderChats = () => {
        if (!chats || !chats.length) {
            return (
                <li className="no-results show">
                    <h6 className="mb-0">No Chats Found</h6>
                </li>
            );
        }

        return chats.map((item) => {
            const time = item.lastMessage ? item.lastMessage.createdAt : new Date();
            const avatarImg = item.client?.avatar || userImg;
            const name = item.client.username;

            return (
                <li
                    key={item._id}
                    onClick={() => handleChatClick(item._id, item.client)}
                    className={classnames({ active: active === item._id })}
                >
                    <Avatar img={avatarImg} imgHeight="42" imgWidth="42" />
                    <div className="chat-info flex-grow-1">
                        <h5 className="mb-0">{name}</h5>
                        <CardText className="text-truncate">
                            {item.lastMessage ? item.lastMessage.content : ""}
                        </CardText>
                    </div>
                    <div className="chat-meta text-nowrap">
                        <small className="float-end mb-25 chat-time ms-25">{formatDate(time)}</small>
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

    // ** Render Filtered Contacts
    const renderContacts = () => {
        if (!filteredUsers || !filteredUsers.length) {
            return (
                <li className="no-results show">
                    <h6 className="mb-0">No Contacts Found</h6>
                </li>
            );
        }

        return filteredUsers.map((user) => {
            const avatarImg = user.avatar || userImg;
            const name = user.username;

            return (
                <li
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className={classnames({ active: active === user._id })}
                >
                    <Avatar img={avatarImg} imgHeight="42" imgWidth="42" />
                    <div className="chat-info flex-grow-1">
                        <h5 className="mb-0">{name}</h5>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleFilter({ target: { value: query } });
                                        }
                                    }}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    {filteredUsers && filteredUsers.length > 0 && (
                        <div className="contact-user-list-wrapper">
                            <h4 className="contact-list-title">Contacts</h4>
                            <ul className="contact-users-list chat-list media-list">{renderContacts()}</ul>
                        </div>
                    )}
                    <PerfectScrollbar
                        className="chat-user-list-wrapper list-group"
                        options={{ wheelPropagation: false }}
                    >
                        <h4 className="chat-list-title">Chats</h4>
                        <ul className="chat-users-list chat-list media-list">{renderChats()}</ul>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    );
};

export default AdminMessageSidebarLeft;
