import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ChatLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="flex-1 flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};

export default ChatLoader;