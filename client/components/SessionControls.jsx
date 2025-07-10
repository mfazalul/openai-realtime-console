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
  layoutMode,
  voice,
  setVoice,
  speed,
  setSpeed,
  temperature,
  setTemperature,
}) {
  const voiceOptions = [
    "alloy",
    "ash",
    "ballad",
    "coral",
    "echo",
    "fable",
    "nova",
    "onyx",
    "sage",
    "shimmer",
  ];
  const speedOptions = Array.from({length: 26}, (_, i) => (0.25 + i * 0.05).toFixed(2));
  const temperatureOptions = Array.from({length: 13}, (_, i) => (0.6 + i * 0.05).toFixed(2));
  if (layoutMode === "bottomFixed") {
    return (
      <div className="flex flex-col w-full">
        <div className="mb-2">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            System Prompt (Instructions)
          </label>
          <textarea
            id="instructions"
            className="w-full border rounded p-2 mt-1"
            style={{ marginBottom: 10, height: '60vh', minHeight: 100 }}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Enter system instructions for the model..."
            disabled={isSessionActive}
          />
        </div>
        <div style={{ marginBottom: 0, marginTop: 'auto' }} className="flex justify-center items-end w-full gap-2">
          {!isSessionActive && (
            <>
              <div className="flex flex-col items-center" style={{marginRight: 10}}>
                <label className="text-xs font-medium text-gray-700 mb-1">Voice</label>
                <select
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                  className="border rounded p-2"
                >
                  {voiceOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center" style={{marginRight: 10}}>
                <label className="text-xs font-medium text-gray-700 mb-1">Speed</label>
                <select
                  value={speed.toFixed(2)}
                  onChange={e => setSpeed(parseFloat(e.target.value))}
                  className="border rounded p-2"
                >
                  {speedOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center" style={{marginRight: 10}}>
                <label className="text-xs font-medium text-gray-700 mb-1">Temperature</label>
                <select
                  value={temperature.toFixed(2)}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="border rounded p-2"
                >
                  {temperatureOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </>
          )}
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
