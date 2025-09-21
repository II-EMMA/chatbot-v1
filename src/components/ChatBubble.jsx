import ReactMarkdown from "react-markdown";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function ChatBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div
      onCopy={(e) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
          e.preventDefault();
          e.clipboardData.setData("text/plain", selection);
        }
      }}
      className={`sm:max-w-[45%] max-w-[50%] px-4 py-2 rounded-lg text-sm mb-4 text-wrap break-words  ${
        isUser
          ? "bg-blue-500 text-white self-end ml-auto"
          : "bg-gray-100 text-gray-800 self-start mr-auto"
      }`}
    >
      {msg.role === "assistant" ? (
        <div className="whitespace-pre-line">
          {msg.loading ? (
            <Spinner variant="ellipsis" />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p
                    {...props}
                    className={
                      msg.content === "Message is empty"
                        ? "text-red-500"
                        : "text-gray-800"
                    }
                  />
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
      ) : (
        msg.content
      )}
    </div>
  );
}
