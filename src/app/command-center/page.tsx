import { InfrastructureScene } from "@/components/three/infrastructure-scene";
import { CommandCenterShell } from "@/components/layout/command-center-shell";

export default function CommandCenterPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0f141b]">
      <InfrastructureScene />
      <CommandCenterShell />
    </div>
  );
}
