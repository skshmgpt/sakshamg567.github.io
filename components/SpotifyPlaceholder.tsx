export default function SpotifyPlaceholder() {
  return (
    <div className="flex flex-col gap-2 pt-4">
      <span className="font-mono text-[9px] text-[#1F1F1C] tracking-[0.08em] uppercase">
        now playing
      </span>
      <span className="font-mono text-[13px] text-[#889988]">
        track name — artist
      </span>
      <div className="flex flex-row items-center gap-2.5">
        <span className="font-mono text-[10px] text-[#889988]">1:24</span>
        <div className="flex-1 h-[3px] bg-[#1F1F1C]">
          <div className="w-[38%] h-full bg-[#00FF41]" />
        </div>
        <span className="font-mono text-[10px] text-[#889988]">3:22</span>
      </div>
      <span className="font-mono text-[9px] text-[#1F1F1C]">coming soon</span>
    </div>
  );
}
