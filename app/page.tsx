import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>My Image</h2>
      <Image width={600} height={315} src="/og/My App" alt="cover" />
    </div>
  );
}
