import { QnAItem } from "@/app/components/QnAList/QnAItem";
import type { QnA } from "@/domain/core";

export const QnAList = ({ items }: { items: QnA[] }) => {
  if (items.length === 0) {
    return <div>{"No questions yet :-("}</div>;
  }

  return (
    <div>
      {items.map((item) => (
        <QnAItem item={item} key={item.id} />
      ))}
    </div>
  );
};
