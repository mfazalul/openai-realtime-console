import { useState } from "react";
import { CloudLightning, CloudOff, MessageSquare } from "react-feather";
import Button from "./Button";

function SessionStopped({ startSession }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button
        onClick={handleStartSession}
        className={isActivating ? "bg-gray-600" : "bg-red-600"}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start session"}
      </Button>
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage }) {
  const [message, setMessage] = useState("");

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim()) {
            handleSendClientEvent();
          }
        }}
        type="text"
        placeholder="send a text message..."
        className="border border-gray-200 rounded-full p-4 flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        onClick={() => {
          if (message.trim()) {
            handleSendClientEvent();
          }
        }}
        icon={<MessageSquare height={16} />}
        className="bg-blue-400"
      >
        send text
      </Button>
      <Button onClick={stopSession} icon={<CloudOff height={16} />}>
        disconnect
      </Button>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  serverEvents,
  isSessionActive,
  instructions,
  setInstructions,
}) {
  return (
    <div className="flex flex-col gap-2 border-t-2 border-gray-200 h-full rounded-md p-2">
      <div className="mb-2">
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          System Prompt (Instructions)
        </label>
        <textarea
          id="instructions"
          className="w-full border rounded p-2 mt-1"
          rows={3}
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Enter system instructions for the model..."
          disabled={isSessionActive}
        />
      </div>
      <div className="flex-1 flex gap-4">
        {isSessionActive ? (
          <SessionActive
            stopSession={stopSession}
            sendClientEvent={sendClientEvent}
            sendTextMessage={sendTextMessage}
            serverEvents={serverEvents}
          />
        ) : (
          <SessionStopped startSession={startSession} />
        )}
      </div>
    </div>
  );
}
