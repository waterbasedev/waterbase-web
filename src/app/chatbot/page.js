import { Thread } from "@assistant-ui/react";
import { MyRuntimeProvider } from "@/app/components/MyRuntimeProvider";

const MyApp = () => {
  return (
    <div className="h-full">
      <MyRuntimeProvider>
        <Thread />
      </MyRuntimeProvider>
    </div>
  );
};

export default MyApp;
