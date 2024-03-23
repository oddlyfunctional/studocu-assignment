import { Provider } from "react-redux";
import { makeStore, type RootState } from "./store";

export const StoreProvider = ({
  initialState = {
    qnas: {
      qnas: [],
      editing: null,
      order: null,
    },
  },
  children,
}: {
  initialState?: RootState;
  children: React.ReactNode;
}) => <Provider store={makeStore(initialState)}>{children}</Provider>;
