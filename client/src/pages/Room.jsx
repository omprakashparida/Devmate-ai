import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import Editor from "@monaco-editor/react";

import socket from "../services/socket";

function Room() {
    const { roomId } = useParams();
    const [usersCount, setUsersCount] = useState(1);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] =
        useState("// Start coding...");

    const [connected, setConnected] =
        useState(false);
        const [review, setReview] =
  useState("");

const [loadingReview,
  setLoadingReview] =
  useState(false);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setConnected(true);

            socket.emit(
                "join-room",
                roomId
            );
        });

        socket.on(
            "users-count",
            (count) => {
                setUsersCount(count);
            }
        );

        socket.on(
            "receive-code",
            (incomingCode) => {
                setCode(incomingCode);
            }
        );

        socket.on(
            "receive-language",
            (incomingLanguage) => {
                setLanguage(
                    incomingLanguage
                );
            }
        );

        socket.on("disconnect", () => {
            setConnected(false);
        });
        const fetchRoom =
            async () => {
                try {
                    const response =
                        await api.get(
                            `/rooms/${roomId}`
                        );

                    setCode(
                        response.data.code ||
                        "// Start coding..."
                    );

                    setLanguage(
                        response.data.language ||
                        "javascript"
                    );
                } catch (error) {
                    console.error(error);
                }
            };

        fetchRoom();

        return () => {
            socket.off("receive-code");
            socket.off("receive-language");
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        const timeout =
            setTimeout(
                async () => {
                    try {
                        await api.put(
                            `/rooms/${roomId}/code`,
                            { code }
                        );
                    } catch (error) {
                        console.error(
                            error
                        );
                    }
                },
                2000
            );

        return () =>
            clearTimeout(
                timeout
            );
    }, [code, roomId]);

    const handleLanguageChange = (
        e
    ) => {
        const selectedLanguage =
            e.target.value;

        setLanguage(
            selectedLanguage
        );

        socket.emit(
            "language-change",
            {
                roomId,
                language:
                    selectedLanguage,
            }
        );
    };
    useEffect(() => {
        const timeout =
            setTimeout(
                async () => {
                    try {
                        await api.put(
                            `/rooms/${roomId}/language`,
                            {
                                language,
                            }
                        );
                    } catch (error) {
                        console.error(
                            error
                        );
                    }
                },
                1000
            );

        return () =>
            clearTimeout(
                timeout
            );
    }, [language, roomId]);

    const handleReview =
  async () => {
    try {
      setLoadingReview(true);

      const response =
        await api.post(
          "/ai/review",
          {
            code,
            language,
          }
        );

      setReview(
        response.data.review
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReview(false);
    }
  };

    return (
        <div>
            <h2>
                Room: {roomId}
            </h2>

            <p>
                {connected
                    ? "Connected"
                    : "Disconnected"}
            </p>
            <p>
                Users Online:
                {usersCount}
            </p>
            <button
  onClick={handleReview}
>
  Review Code
</button>
{loadingReview && (
  <p>
    Reviewing...
  </p>
)}

{review && (
  <div>
    <h3>
      AI Review
    </h3>

    <pre>
      {review}
    </pre>
  </div>
)}
            <select
                value={language}
                onChange={handleLanguageChange}
            >
                <option value="javascript">
                    JavaScript
                </option>

                <option value="python">
                    Python
                </option>

                <option value="java">
                    Java
                </option>

                <option value="cpp">
                    C++
                </option>
            </select>
            <Editor

                height="80vh"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                    setCode(value);

                    socket.emit(
                        "code-change",
                        {
                            roomId,
                            code: value,
                        }
                    );
                }}
            />
        </div>

    );
}

export default Room;