import { QnAItem } from "@/app/components/QnAList/QnAItem";
import type { QnA } from "@/domain/core";

export const QnAList = ({ items }: { items: QnA[] }) => {
  return (
    <div>
      {items.map((item) => (
        <QnAItem item={item} key={item.id} />
      ))}
    </div>
  );
};
