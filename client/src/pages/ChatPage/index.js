import Chat from "./../../components/Chat";
import UsersList from "./../../components/UsersList";
import "./ChatPage.css";
import { ChatMessage, ReceiveMsgRequest, Empty } from "./../../chat_pb";
import { useEffect, useState } from "react";

export default function ChatPage({ client }) {
  const [users, setUsers] = useState([]);
  const [msgList, setMsgList] = useState([]);
  const username = window.localStorage.getItem("username");

  useEffect(() => {
    console.log("Setting up chat stream.");
    const strRq = new ReceiveMsgRequest();
    strRq.setUser(username);

    const chatStream = client.receiveMsg(strRq, {});
    chatStream.on("data", (response) => {
      const from = response.getFrom();
      const msg = response.getMsg();
      const time = response.getTime();
      console.log(`Received message from ${from}: ${msg}`);

      if (from === username) {
        setMsgList((oldArray) => [
          ...oldArray,
          { from, msg, time, mine: true },
        ]);
      } else {
        setMsgList((oldArray) => [...oldArray, { from, msg, time }]);
      }
    });

    chatStream.on("status", function (status) {
      console.log(status.code, status.details, status.metadata);
    });

    chatStream.on("end", () => {
      console.log("Stream ended.");
    });

    return () => {
      console.log("Cleaning up chat stream.");
      chatStream.cancel();
    };
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  function getAllUsers() {
    console.log("Fetching all users...");
    client.getAllUsers(new Empty(), null, (err, response) => {
      let usersList = response?.getUsersList() || [];
      usersList = usersList
        .map((user) => {
          return {
            id: user.array[0],
            name: user.array[1],
          };
        })
        .filter((u) => u.name !== username);
      setUsers(usersList);
    });
  }

  function sendMessage(message) {
    console.log(`Sending message: ${message}`);
    const msg = new ChatMessage();
    msg.setMsg(message);
    msg.setFrom(username);
    msg.setTime(new Date().toLocaleString());

    client.sendMsg(msg, null, (err, response) => {
      console.log(response);
    });
  }

  return (
    <div className="chatpage">
      <div className="userslist-section">
        <div
          style={{ paddingBottom: "4px", borderBottom: "1px solid darkgray" }}
        >
          <div>
            <button onClick={getAllUsers}>REFRESH</button>
          </div>
          <div>
            <span>
              Logged in as <b>{username}</b>
            </span>
          </div>
        </div>
        <UsersList users={users} />
      </div>
      <div className="chatpage-section">
        <Chat msgList={msgList} sendMessage={sendMessage} />
      </div>
    </div>
  );
}
