import { AssistanceChat } from '@/components/assistance/assistance-chat';

export default function AssistancePage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Yardım Merkezi</h1>
        <p className="text-muted-foreground">
          Yapay zeka asistanımıza danışın veya bir veterinerle canlı görüşme başlatın.
        </p>
      </div>
      <AssistanceChat />
    </>
  );
}
