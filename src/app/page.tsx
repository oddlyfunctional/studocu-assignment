import { QnAList } from "@/app/components/QnAList/QnAList";
import type { NonEmptyString, QnA } from "@/domain/core";

export default function Home() {
  const mockItems: QnA[] = [
    {
      id: "id1",
      question: "some question" as NonEmptyString,
      answer: "some answer" as NonEmptyString,
      createdAt: new Date("2024-01-01 00:00:00"),
    },
    {
      id: "id2",
      question: "another question" as NonEmptyString,
      answer: "another answer" as NonEmptyString,
      createdAt: new Date("2024-01-02 00:00:00"),
    },
  ];

  return (
    <main>
      <h1>The awesome Q/A tool</h1>

      <div>
        <h2>Created questions</h2>
        <QnAList items={mockItems} />
      </div>
    </main>
  );
}
