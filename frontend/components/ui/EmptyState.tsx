import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Kuch nahi mila",
  message = "Yahan abhi koi data nahi hai.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center mb-4">
        <Inbox className="text-orange-500" size={28} />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{message}</p>
    </div>
  );
}