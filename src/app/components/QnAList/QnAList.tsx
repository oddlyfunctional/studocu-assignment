import { QnAItem } from "@/app/components/QnAList/QnAItem";
import type { QnA } from "@/domain/core";

export const QnAList = ({
  items,
  onRemove,
  onEdit,
}: {
  items: QnA[];
  onRemove: (item: QnA) => void;
  onEdit: (item: QnA) => void;
}) => {
  return (
    <dl role="list">
      {items.length === 0 && <div>{"No questions yet :-("}</div>}
      {items.map((item) => (
        <QnAItem
          item={item}
          key={item.id}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </dl>
  );
};
