"use client";

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--lb-accent)]" : "bg-[var(--lb-border)]"
      }`}
    >
      <div
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-[left] ${
          checked ? "left-[21px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}
