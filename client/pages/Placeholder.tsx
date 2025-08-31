import { ReactNode } from "react";

export default function Placeholder({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-muted-foreground">
        {description || (
          <>
            This section is ready to be built next. Tell me what data and visuals you want here and Ill wire it up.
          </>
        )}
      </p>
    </div>
  );
}
