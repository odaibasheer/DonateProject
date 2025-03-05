import { Fragment, useEffect, useState } from "react";
import { useGetContactsQuery } from "../../redux/api/contactAPI";
import ClientMessageSidebarLeft from "../../components/ClientMessageSidebarLeft";
import ClientChat from "../../components/ClientChat";

const VolunteerMessage = () => {
    const { data: chats, refetch } = useGetContactsQuery();
    const [messages, setMessages] = useState({});
    const [selectedContact, setSelectedContact] = useState({
        contactId: null
    });
    const [selectedUser, setSelectedUser] = useState({
        provider: null
    });

    useEffect(() => {
        refetch();
    }, [messages]);

    return (
        <div className="container main-view">
            <div className="content-area-wrapper p-0">
                <Fragment>
                    <ClientMessageSidebarLeft
                        setSelectedContact={setSelectedContact}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                        messages={messages}
                        setMessages={setMessages}
                        chats={chats}
                    />
                    <div className="content-right">
                        <div className="content-wrapper">
                            <div className="content-body">
                                <div className="body-content-overlay"></div>
                                <ClientChat
                                    selectedContact={selectedContact}
                                    setSelectedContact={setSelectedContact}
                                    selectedUser={selectedUser}
                                    setSelectedUser={setSelectedUser}
                                    messages={messages}
                                    setMessages={setMessages}
                                />
                            </div>
                        </div>
                    </div>
                </Fragment>
            </div>
        </div>
    )
}

export default VolunteerMessage;