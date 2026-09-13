import { redirect } from "next/navigation";

const RESUME_URL =
  "https://drive.google.com/file/d/1vpfvxKhiEPUZ9x2SvAzNaV4MqF4ExWSA/view?usp=sharing";

export async function GET() {
  redirect(RESUME_URL);
}
