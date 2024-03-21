import { Tooltip } from "@/app/components/Tooltip/Tooltip";
import { render, screen } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { useRef } from "react";

describe("Tooltip", () => {
  it("shows on hover", async () => {
    const App = () => {
      const anchorRef = useRef(null);
      return (
        <div>
          <div ref={anchorRef}>anchor</div>
          <Tooltip anchorRef={anchorRef}>tooltip</Tooltip>
        </div>
      );
    };

    const userEvent = UserEvent.setup();
    render(<App />);
    expect(screen.queryByText("tooltip")).not.toBeInTheDocument;
    await userEvent.hover(screen.getByText("anchor"));
    expect(screen.queryByText("tooltip")).toBeInTheDocument;
  });
});
