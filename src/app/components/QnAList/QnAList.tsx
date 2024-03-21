import { QnAItem } from "@/app/components/QnAList/QnAItem";
import type { QnA } from "@/domain/core";

export const QnAList = ({ items }: { items: QnA[] }) => {
  return (
    <dl role="list">
      {items.length === 0 && <div>{"No questions yet :-("}</div>}
      {items.map((item) => (
        <QnAItem item={item} key={item.id} />
      ))}
    </dl>
  );
};
